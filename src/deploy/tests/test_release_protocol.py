"""发布绑定协议测试：仅构造固定 Git API 与临时响应，不访问外部服务。"""
import base64
import copy
import json
import unittest
from unittest.mock import patch
from test_static_update import load, fixture, fake_request
import test_static_update as old_tests

S = 'c' * 40
P = '9' * 40

def setup_protocol(m, manifest_change=None, provenance_change=None, preview=False, about=False):
    entries, bodies = fixture(m)
    if about:
        for path in ('about/index.html', 'zh/about/index.html', 'en/about/index.html'):
            bodies[path] = b'<html>about alias or page</html>'
            entries.append({'path': path, 'mode': '100644', 'type': 'blob',
                            'size': len(bodies[path]), 'sha': m.git_blob_hash(bodies[path])})
    if preview:
        for path in m.PAGES_ONLY:
            bodies[path] = b'<html>historic preview</html>'
            entries.append({'path': path, 'mode': '100644', 'type': 'blob',
                            'size': len(bodies[path]), 'sha': m.git_blob_hash(bodies[path])})
    files = [{'path': e['path'], 'size': e['size'], 'gitBlob': e['sha'],
              'sha256': m.hashlib.sha256(bodies[e['path']]).hexdigest(),
              'target': 'pages-only' if e['path'] in m.PAGES_ONLY else 'both'}
             for e in sorted(entries, key=lambda e: e['path'])]
    manifest = {'version': 1, 'files': files}
    if manifest_change:
        manifest_change(manifest)
    manifest_bytes = json.dumps(manifest).encode()
    provenance = {'version': 1, 'sourceCommit': S,
                  'manifestPath': 'src/deploy/release-manifest.json',
                  'manifestSha256': m.hashlib.sha256(manifest_bytes).hexdigest()}
    if provenance_change:
        provenance_change(provenance)
    bodies['release-provenance.json'] = json.dumps(provenance).encode()
    entries.append({'path': 'release-provenance.json', 'mode': '100644', 'type': 'blob',
                    'size': len(bodies['release-provenance.json']),
                    'sha': m.git_blob_hash(bodies['release-provenance.json'])})
    source_item = {'path': 'src/deploy/release-manifest.json', 'mode': '100644', 'type': 'blob',
                   'size': len(manifest_bytes), 'sha': m.git_blob_hash(manifest_bytes)}
    def api(url):
        if url.startswith('/git/commits/'):
            sha = url.rsplit('/', 1)[1]
            return {'sha': sha, 'tree': {'sha': ('e' if sha == S else 'f') * 40}}
        if url.startswith('/git/trees/'):
            tree_sha = url.split('/')[3].split('?')[0]
            return {'sha': tree_sha, 'tree': [source_item] if tree_sha == 'e' * 40 else entries, 'truncated': False}
        if url.startswith('/git/blobs/'):
            sha = url.rsplit('/', 1)[1]
            body = manifest_bytes if sha == source_item['sha'] else next(b for b in bodies.values() if m.git_blob_hash(b) == sha)
            return {'sha': sha, 'size': len(body), 'encoding': 'base64', 'content': base64.b64encode(body).decode()}
        raise AssertionError(url)
    return entries, bodies, manifest, provenance, api

class ReleaseProtocol(unittest.TestCase):
    def test_exact_about_alias_and_language_pages_bind_without_opening_about_source(self):
        m = load(); _, bodies, _, _, api = setup_protocol(m, about=True)
        with patch.object(m, 'api', side_effect=api):
            entries = m.release_entries(S, P)
        self.assertEqual(entries['about/index.html']['target'], 'both')
        with patch.object(m, 'request', side_effect=fake_request(m, bodies)):
            for pair in entries.items():
                m.fetch_one(pair)
        for path in ('about/extra.html', 'about/profile.json', 'about/client.js', 'src/about/profile.json'):
            with self.subTest(path=path):
                m = load()
                def change(manifest):
                    next(r for r in manifest['files'] if r['path'] == 'about/index.html')['path'] = path
                    manifest['files'].sort(key=lambda r: r['path'])
                artifact, _, _, _, api = setup_protocol(m, change, about=True)
                next(e for e in artifact if e['path'] == 'about/index.html')['path'] = path
                with patch.object(m, 'api', side_effect=api), self.assertRaises(ValueError):
                    m.release_entries(S, P)
    def test_independent_commits_bind_successfully(self):
        m = load(); entries, bodies, _, _, api = setup_protocol(m)
        with patch.object(m, 'api', side_effect=api):
            result = m.release_entries(S, P)
        self.assertIn('index.html', result)
        self.assertFalse(m.deployable('release-provenance.json', result['release-provenance.json']))

    def test_bad_protocol_never_downgrades(self):
        m = load(); entries, bodies, _, _, api = setup_protocol(m)
        entries[-1]['mode'] = '120000'
        with patch.object(m, 'api', side_effect=api), patch.object(m, 'tree_for') as legacy:
            with self.assertRaises(ValueError):
                m.release_entries(S, P)
            legacy.assert_not_called()

    def test_only_exact_s0_accepts_absent_metadata(self):
        m = load(); entries, bodies, _, _, api = setup_protocol(m)
        entries.pop()
        with patch.object(m, 'api', side_effect=api), patch.object(m, 'tree_for', return_value={'ok': {}}):
            self.assertEqual(m.release_entries(m.LEGACY_BASELINE_SHA, m.LEGACY_BASELINE_SHA), {'ok': {}})
            with self.assertRaises(ValueError):
                m.release_entries(S, S)

    def test_ref_drift_is_rejected(self):
        m = load()
        with patch.object(m, 'branch_sha', side_effect=[S, 'a' * 40]):
            with self.assertRaises(ValueError):
                m.assert_refs(S, P)

    def test_wrong_source_hash_fields_paths_and_target_are_rejected(self):
        defects = [
            ('source', None, lambda p: p.update(sourceCommit='a' * 40)),
            ('digest', None, lambda p: p.update(manifestSha256='a' * 64)),
            ('metadata unknown', None, lambda p: p.update(extra=True)),
            ('manifest unknown', lambda x: x.update(extra=True), None),
            ('file unknown', lambda x: x['files'][0].update(extra=True), None),
            ('duplicate', lambda x: x['files'].append(copy.deepcopy(x['files'][0])), None),
            ('escape', lambda x: x['files'][0].update(path='../index.html'), None),
            ('target', lambda x: x['files'][0].update(target='pages-only'), None),
            ('git blob', lambda x: x['files'][0].update(gitBlob='a' * 40), None),
        ]
        for name, manifest_change, provenance_change in defects:
            with self.subTest(name=name):
                m = load(); _, _, _, _, api = setup_protocol(m, manifest_change, provenance_change)
                with patch.object(m, 'api', side_effect=api), self.assertRaises(ValueError):
                    m.release_entries(S, P)

    def test_extra_missing_and_symlink_artifact_are_rejected(self):
        for defect in ('extra', 'missing', 'symlink'):
            with self.subTest(defect=defect):
                m = load(); entries, _, _, _, api = setup_protocol(m)
                if defect == 'extra':
                    entries.append({'path': 'src/private.md', 'type': 'blob', 'mode': '100644', 'size': 0, 'sha': 'a' * 40})
                elif defect == 'missing':
                    entries.pop(0)
                else:
                    entries[0]['mode'] = '120000'
                with patch.object(m, 'api', side_effect=api), self.assertRaises(ValueError):
                    m.release_entries(S, P)

    def test_manifest_sha256_is_verified_against_pages(self):
        m = load(); _, bodies, _, _, api = setup_protocol(m, lambda x: x['files'][0].update(sha256='a' * 64))
        with patch.object(m, 'api', side_effect=api):
            entries = m.release_entries(S, P)
        with patch.object(m, 'request', side_effect=fake_request(m, bodies)), self.assertRaises(ValueError):
            for pair in entries.items():
                m.fetch_one(pair)

    def test_exact_preview_paths_are_verified_but_not_deployed(self):
        m = load(); _, bodies, _, _, api = setup_protocol(m, preview=True)
        with patch.object(m, 'api', side_effect=api):
            entries = m.release_entries(S, P)
        self.assertTrue(all(not m.deployable(p, entries[p]) for p in m.PAGES_ONLY))
        with patch.object(m, 'request', side_effect=fake_request(m, bodies)):
            for pair in entries.items():
                m.fetch_one(pair)

    def test_strict_blob_limits_unknown_encoding_and_duplicate_json(self):
        m = load(); body = b'{}'; item = {'mode': '100644', 'type': 'blob', 'size': 2, 'sha': m.git_blob_hash(body)}
        good = {'sha': item['sha'], 'size': 2, 'encoding': 'base64', 'content': 'e30='}
        for change in ({'encoding': 'utf-8'}, {'content': '!!!!'}, {'content': 'A' * 8193}, {'size': True}):
            with patch.object(m, 'api', return_value={**good, **change}), self.assertRaises(ValueError):
                m.strict_blob(item, 4096)
        with self.assertRaises(ValueError):
            m.strict_blob({**item, 'size': 4097}, 4096)
        with self.assertRaises(ValueError):
            m.strict_json(b'{"version":1,"version":1}')

class NewProtocolDeployment(old_tests.DeploymentTests):
    def setUp(self):
        super().setUp()
        self.entries, self.bodies, _, _, api = setup_protocol(self.m)
        self.handles[1].side_effect = lambda branch: S if branch == 'main' else P
        api_patch = patch.object(self.m, 'api', side_effect=api)
        request_patch = patch.object(self.m, 'request', side_effect=fake_request(self.m, self.bodies))
        self.protocol_api = api_patch.start(); self.protocol_request = request_patch.start()
        self.addCleanup(api_patch.stop); self.addCleanup(request_patch.stop)

    def test_success_does_not_copy_metadata_or_previews(self):
        self.entries, self.bodies, _, _, api = setup_protocol(self.m, preview=True)
        self.protocol_api.side_effect = api
        self.protocol_request.side_effect = fake_request(self.m, self.bodies)
        with patch.object(self.m, 'add_current_assets'), patch.object(self.m, 'health'):
            self.run_main([])
        target = self.m.POINTER.resolve()
        self.assertEqual(target.name, P)
        self.assertFalse((target / self.m.PROVENANCE_PATH).exists())
        self.assertFalse((target / 'design-preview').exists())

    def test_ref_drift_before_switch_keeps_old_pointer(self):
        self.handles[1].side_effect = [P, S, S, 'a' * 40]
        with patch.object(self.m, 'add_current_assets'), self.assertRaises(ValueError):
            self.run_main([])
        self.assertEqual(self.m.POINTER.resolve(), self.old)

    def test_three_failures_do_not_mutate_state_or_retry_sha(self):
        self.state.update({'failed_sha': P, 'failures': 3})
        with self.assertRaises(ValueError):
            self.run_main([])
        self.assertEqual(self.state, {'failed_sha': P, 'failures': 3})
        self.handles[3].assert_not_called()

if __name__ == '__main__':
    unittest.main()
