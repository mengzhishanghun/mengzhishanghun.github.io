"""隔离部署门禁测试：仅使用临时目录与受控 HTTP/API 响应。"""
import base64
import importlib.util
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

SOURCE = Path(__file__).resolve().parents[1] / 'mzsh-static-update.py'
SHA = 'a' * 40
TREE_SHA = 'b' * 40


def load():
    spec = importlib.util.spec_from_file_location('static_update', SOURCE)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def registry(codes=('zh', 'en')):
    return {'version': 1, 'primary': codes[0], 'fallback': 'en',
            'languages': [{'code': code, 'label': code, 'htmlLang': code,
                           'searchLanguage': code, 'browserTags': [code, code + '-*']}
                          for code in codes]}


def fixture(m, files=895, html=328, config=None):
    bodies = {name: b'<html>https://mzsh.me</html>' for name in m.REQUIRED}
    for i in range(html - len(bodies)):
        bodies[f'zh/page-{i}/index.html'] = b'<html>page</html>'
    bodies['_astro/app.abcdefgh.js'] = b'console.log(1)'
    bodies['site-languages.json'] = json.dumps(config or registry()).encode()
    for i in range(files - len(bodies)):
        bodies[f'assets/file-{i}.txt'] = b'asset'
    entries = [{'path': path, 'type': 'blob', 'mode': '100644', 'size': len(body),
                'sha': m.git_blob_hash(body)} for path, body in bodies.items()]
    return entries, bodies


def fake_api(entries, bodies, blob_override=None):
    def api(path):
        if path.startswith('/git/commits/'):
            return {'sha': path.rsplit('/', 1)[1], 'tree': {'sha': TREE_SHA}}
        if path == '/git/trees/' + TREE_SHA + '?recursive=1':
            return {'sha': TREE_SHA, 'truncated': False, 'tree': entries}
        item = next((e for e in entries if e['path'] == 'site-languages.json'), None)
        if item and path == '/git/blobs/' + item['sha']:
            return blob_override if blob_override is not None else {
                'sha': item['sha'], 'size': len(bodies['site-languages.json']),
                'encoding': 'base64', 'content': base64.b64encode(bodies['site-languages.json']).decode('ascii')}
        raise AssertionError('Unexpected API: ' + path)
    return api


def fake_request(m, bodies):
    def request(url, **kwargs):
        if url.startswith(m.PAGES):
            return bodies[url[len(m.PAGES):]]
        raise AssertionError('Unexpected request: ' + url)
    return request


class PublicTreeTests(unittest.TestCase):
    def setUp(self):
        self.m = load()
        self.entries, self.bodies = fixture(self.m)

    def tree(self, entries=None, bodies=None, **kwargs):
        with patch.object(self.m, 'api', fake_api(entries or self.entries, bodies or self.bodies, kwargs.pop('blob', None))), \
             patch.object(self.m, 'request', fake_request(self.m, bodies or self.bodies)):
            return self.m.tree_for(kwargs.pop('sha', SHA), **kwargs)

    def test_current_895_public_files_and_328_html_fit(self):
        self.assertEqual(len(self.tree()), 895)

    def test_source_and_private_metadata_do_not_enter_public_validation(self):
        entries = self.entries + [
            {'path': 'content/001-zh/draft.md', 'type': 'blob', 'mode': '100644', 'size': 200_000_000},
            {'path': 'tools/private.py', 'type': 'blob', 'mode': '100755'},
            {'path': 'src/link', 'type': 'blob', 'mode': '120000'},
            {'path': '.git/config', 'type': 'blob', 'mode': '100644'},
            {'path': '.codex/state.json', 'type': 'blob', 'mode': '100644'},
        ]
        self.assertEqual(set(self.tree(entries)), set(self.bodies))

    def test_enabled_french_root_is_public(self):
        entries, bodies = fixture(self.m, config=registry(('zh', 'en', 'fr')))
        body = b'<html>French</html>'
        entries.append({'path': 'fr/article/index.html', 'type': 'blob', 'mode': '100644',
                        'size': len(body), 'sha': self.m.git_blob_hash(body)})
        self.assertIn('fr/article/index.html', self.tree(entries, bodies))

    def test_invalid_registry_is_rejected(self):
        for config in [registry(('zh', 'en', '../src')), registry(('zh', 'en', 'src')),
                       registry(('zh', 'en', 'en')), {**registry(), 'privateRoot': 'content'},
                       {**registry(), 'languages': registry()['languages'] * 17}]:
            with self.subTest(config=config):
                entries, bodies = fixture(self.m, files=700, html=200, config=config)
                with self.assertRaises(ValueError):
                    self.tree(entries, bodies)

    def test_current_missing_registry_is_rejected_even_for_historical_sha(self):
        entries, bodies = fixture(self.m, files=700, html=200)
        entries = [e for e in entries if e['path'] != 'site-languages.json']
        with self.assertRaises(ValueError):
            self.tree(entries, bodies)
        with self.assertRaises(ValueError):
            self.tree(entries, bodies, sha=self.m.HISTORIC_RELEASES[0])

    def test_registry_bytes_must_match_its_commit_blob(self):
        entries, bodies = fixture(self.m, files=700, html=200)
        bodies['site-languages.json'] = b'{}'
        with self.assertRaises(ValueError):
            self.tree(entries, bodies)

    def registry_blob(self):
        body = self.bodies['site-languages.json']
        return {'sha': self.m.git_blob_hash(body), 'size': len(body), 'encoding': 'base64',
                'content': base64.b64encode(body).decode('ascii')}

    def test_registry_api_blob_accepts_crlf_wrapping_without_raw_request(self):
        blob = self.registry_blob()
        blob['content'] = '\r\n'.join(blob['content'][i:i+60] for i in range(0, len(blob['content']), 60)) + '\n'
        self.assertEqual(len(self.tree(blob=blob)), 895)

    def test_registry_api_blob_rejects_invalid_fields_and_encoding(self):
        for change in [{'encoding': 'utf-8'}, {'sha': 'c' * 40}, {'size': True},
                       {'size': 0}, {'content': None}, {'content': '!!!!'},
                       {'content': 'e30= '}, {'content': 'é'},
                       {'content': 'A' * 90_000}, {'content': 'e30='},
                       {'content': base64.b64encode(b'x' * len(self.bodies['site-languages.json'])).decode('ascii')},
                       {'content': base64.b64encode(b'x' * 64_001).decode('ascii')}]:
            with self.subTest(change=change), self.assertRaises(ValueError):
                self.tree(blob={**self.registry_blob(), **change})

    def test_registry_api_blob_rejects_non_object_or_missing_fields(self):
        for blob in [[], {}, {'sha': self.registry_blob()['sha']}]:
            with self.subTest(blob=blob), self.assertRaises(ValueError):
                self.tree(blob=blob)

    def test_public_unsafe_path_symlink_type_or_size_is_rejected(self):
        for change in [{'path': 'assets/../secret.txt'}, {'path': 'assets//bad.txt'},
                       {'path': 'assets\\bad.txt'}, {'mode': '120000'},
                       {'mode': '100755'}, {'path': 'assets/run.py'},
                       {'size': -1}, {'size': 150_000_001}]:
            item = {'path': 'assets/test.txt', 'type': 'blob', 'mode': '100644',
                    'size': 1, 'sha': 'c' * 40, **change}
            with self.subTest(change=change), self.assertRaises(ValueError):
                self.tree(self.entries + [item])

    def test_fixed_historical_mode_allows_missing_registry_only(self):
        entries, bodies = fixture(self.m, files=700, html=200)
        entries = [e for e in entries if e['path'] != 'site-languages.json']
        self.assertIn('_astro/app.abcdefgh.js', self.tree(entries, bodies, sha=self.m.HISTORIC_RELEASES[0], history=True))
        with self.assertRaises(ValueError):
            self.tree(entries, bodies, sha=SHA, history=True)
        invalid = [e for e in self.entries if e['path'] != 'site-languages.json']
        invalid.append({'path': 'site-languages.json', 'type': 'blob', 'mode': '100644', 'size': 2, 'sha': self.m.git_blob_hash(b'{}')})
        with self.assertRaises(ValueError):
            self.tree(invalid, {**bodies, 'site-languages.json': b'{}'}, sha=self.m.HISTORIC_RELEASES[0], history=True)


class DeploymentTests(unittest.TestCase):
    def setUp(self):
        self.m = load()
        self.m.LEGACY_BASELINE_SHA = SHA
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        root = Path(self.temp.name).resolve()
        self.m.ROOT = root / 'releases'
        self.m.ROOT.mkdir()
        self.old = self.m.ROOT / ('d' * 40)
        self.old.mkdir()
        self.m.POINTER = root / 'current'
        os.symlink(self.old, self.m.POINTER, target_is_directory=True)
        self.m.CONFIG = root / 'Caddyfile'
        self.m.CONFIG.write_bytes(b'config')
        self.entries, self.bodies = fixture(self.m, files=110, html=100)
        self.state = {}
        self.patches = [patch.object(self.m, 'validate_caddy', return_value=self.m.hashlib.sha256(b'config').hexdigest()),
                        patch.object(self.m, 'branch_sha', return_value=SHA),
                        patch.object(self.m, 'state_read', side_effect=lambda: dict(self.state)),
                        patch.object(self.m, 'state_write', side_effect=lambda s: self.state.update(s)),
                        patch.object(self.m, 'api', fake_api(self.entries, self.bodies)),
                        patch.object(self.m, 'request', fake_request(self.m, self.bodies)),
                        patch.object(self.m, 'archive_read', return_value={'version': 1, 'files': {}}),
                        patch.object(self.m, 'archive_write'), patch.object(self.m, 'subprocess')]
        # Windows 不能原子覆盖目录符号链接；仅替换这一 POSIX 系统调用边界。
        # 部署控制流程、临时发布树和回滚指针仍使用真实文件系统。
        if os.name == 'nt':
            replace = os.replace
            symlink = os.symlink
            def replace_posix(source, destination):
                if Path(destination).is_symlink():
                    Path(destination).unlink()
                return replace(source, destination)
            self.patches.extend([
                patch.object(self.m.os, 'replace', side_effect=replace_posix),
                patch.object(self.m.os, 'symlink', side_effect=lambda source, target: symlink(source, target, target_is_directory=True)),
            ])
        self.handles = [p.start() for p in self.patches]
        for p in self.patches:
            self.addCleanup(p.stop)

    def run_main(self, args):
        with patch.object(self.m.sys, 'argv', [str(SOURCE), *args]):
            self.m.main()

    def test_check_is_read_only_and_verifies_candidate_pages(self):
        with patch.object(self.m, 'add_current_assets', side_effect=AssertionError('archive mutation')), \
             patch.object(self.m, 'backfill_archive', side_effect=AssertionError('archive mutation')):
            self.run_main(['--check'])
        self.assertEqual(self.state, {})
        self.assertEqual(self.m.POINTER.resolve(), self.old)
        self.assertEqual(list(self.m.ROOT.iterdir()), [self.old])
        self.handles[3].assert_not_called()
        self.handles[7].assert_not_called()
        self.handles[8].run.assert_not_called()

    def test_pages_byte_mismatch_does_not_switch_and_records_failure(self):
        self.bodies['index.html'] = b'wrong'
        with self.assertRaises(ValueError):
            self.run_main([])
        self.assertEqual(self.m.POINTER.resolve(), self.old)
        self.assertEqual(self.state['failures'], 1)
        self.assertEqual(list(self.m.ROOT.iterdir()), [self.old])

    def test_https_failure_rolls_back_pointer(self):
        with patch.object(self.m, 'add_current_assets'), patch.object(self.m, 'health', side_effect=ValueError('HTTPS mismatch')):
            with self.assertRaises(ValueError):
                self.run_main([])
        self.assertEqual(self.m.POINTER.resolve(), self.old)
        self.assertEqual(self.state['failures'], 1)
        self.assertEqual(self.handles[8].run.call_count, 2)

    def test_check_byte_mismatch_has_no_state_or_archive_writes(self):
        self.bodies['index.html'] = b'wrong'
        with self.assertRaises(ValueError):
            self.run_main(['--check'])
        self.assertEqual(self.state, {})
        self.handles[3].assert_not_called()
        self.handles[7].assert_not_called()
        self.assertEqual(self.m.POINTER.resolve(), self.old)
        self.assertEqual(list(self.m.ROOT.iterdir()), [self.old])

    def test_historical_asset_is_accepted_only_with_matching_git_blob(self):
        self.m.ASTRO_ARCHIVE = Path(self.temp.name).resolve() / 'archive'
        manifest = {'version': 1, 'files': {}}
        body = b'console.log(1)'
        path = '_astro/app.abcdefgh.js'
        self.m.archive_add_one(manifest, path, body, self.m.git_blob_hash(body), self.m.HISTORIC_RELEASES[0])
        self.assertEqual((self.m.ASTRO_ARCHIVE / path).read_bytes(), body)
        self.assertEqual(manifest['files'][path]['sha256'], self.m.hashlib.sha256(body).hexdigest())
        with self.assertRaises(ValueError):
            self.m.archive_add_one(manifest, path, b'changed', self.m.git_blob_hash(body), self.m.HISTORIC_RELEASES[0])

    def test_three_failures_do_not_mutate_state_or_retry_sha(self):
        self.state.update({'failed_sha': SHA, 'failures': 3})
        with self.assertRaises(ValueError):
            self.run_main([])
        self.assertEqual(self.state, {'failed_sha': SHA, 'failures': 3})
        self.handles[3].assert_not_called()
        self.assertEqual(self.m.POINTER.resolve(), self.old)


if __name__ == '__main__':
    unittest.main()
