"""隔离部署门禁测试：仅使用临时目录与受控 HTTP/API 响应。"""
import base64
import importlib.util
import json
import os
import hashlib
import socket
import ssl
import threading
import subprocess
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
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

    def test_current_release_424_html_fit(self):
        entries, bodies = fixture(self.m, html=424)
        result = self.tree(entries, bodies)
        self.assertEqual(sum(path.endswith('.html') for path in result), 424)

    def test_current_bilingual_html_capacity_boundary(self):
        entries, bodies = fixture(self.m, html=700)
        result = self.tree(entries, bodies)
        self.assertEqual(sum(path.endswith('.html') for path in result), 700)
        entries, bodies = fixture(self.m, html=701)
        with self.assertRaisesRegex(ValueError, 'HTML capacity exceeded'):
            self.tree(entries, bodies)

    def test_current_required_pages_remain_mandatory(self):
        entries, bodies = fixture(self.m, html=424)
        for required in self.m.REQUIRED:
            with self.subTest(required=required), self.assertRaisesRegex(ValueError, 'critical pages missing'):
                self.tree([entry for entry in entries if entry['path'] != required], bodies)

    def test_historical_html_capacity_remains_300(self):
        entries, bodies = fixture(self.m, files=700, html=300)
        result = self.tree(entries, bodies, sha=self.m.HISTORIC_RELEASES[0], history=True)
        self.assertEqual(sum(path.endswith('.html') for path in result), 300)
        entries, bodies = fixture(self.m, files=700, html=301)
        with self.assertRaisesRegex(ValueError, 'HTML capacity exceeded'):
            self.tree(entries, bodies, sha=self.m.HISTORIC_RELEASES[0], history=True)

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
        self.m.STATE = root / 'state' / 'state.json'
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
        self.assertTrue((self.m.ROOT / self.state['failed_sha']).is_dir())

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

    def test_same_asset_name_rejects_changed_bytes_even_with_valid_current_blob(self):
        self.m.ASTRO_ARCHIVE = Path(self.temp.name).resolve() / 'archive'
        manifest = {'version': 1, 'files': {}}
        path = '_astro/app.abcdefgh.js'
        original = b'console.log(1)\n'
        changed = b'console.log(1)\r\n'
        self.m.archive_add_one(manifest, path, original, self.m.git_blob_hash(original), self.m.HISTORIC_RELEASES[0])
        before = json.loads(json.dumps(manifest))
        stage = Path(self.temp.name).resolve() / 'stage'
        (stage / '_astro').mkdir(parents=True)
        (stage / path).write_bytes(changed)
        entries = {path: {'sha': self.m.git_blob_hash(changed)}}

        with self.assertRaisesRegex(ValueError, 'hashed asset name collision'):
            self.m.add_current_assets(manifest, entries, stage, SHA)
        with self.assertRaisesRegex(ValueError, 'current asset conflicts with history'):
            self.m.copy_archive_to_stage(manifest, entries, stage)

        self.assertEqual(manifest, before)
        self.assertEqual((self.m.ASTRO_ARCHIVE / path).read_bytes(), original)
        self.assertEqual((stage / path).read_bytes(), changed)

    def test_three_failures_do_not_mutate_state_or_retry_sha(self):
        self.state.update({'failed_sha': SHA, 'failures': 3})
        with self.assertRaises(ValueError):
            self.run_main([])
        self.assertEqual(self.state, {'failed_sha': SHA, 'failures': 3})
        self.handles[3].assert_not_called()
        self.assertEqual(self.m.POINTER.resolve(), self.old)

    def test_term_after_switch_does_not_interrupt_rollback(self):
        def unhealthy(_):
            self.m.signal.raise_signal(self.m.signal.SIGTERM)
            raise ValueError('HTTPS mismatch after TERM')
        with patch.object(self.m, 'add_current_assets'), patch.object(self.m, 'health', side_effect=unhealthy):
            with self.assertRaisesRegex(ValueError, 'HTTPS mismatch after TERM'):
                self.run_main([])
        self.assertEqual(self.m.POINTER.resolve(), self.old)
        self.assertEqual(self.state['failures'], 1)
        self.assertEqual(self.handles[8].run.call_count, 2)


class ResumableDownloadTests(unittest.TestCase):
    """Failures here catch lost validated files, unsafe reuse and unbounded retries."""
    def setUp(self):
        self.m = load()
        self.assertTrue(hasattr(self.m, 'DownloadControl'), 'bounded resumable downloader is missing')
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name).resolve()
        self.m.STATE = self.root / 'state' / 'state.json'
        self.bodies = {'assets/a.txt': b'alpha', 'assets/b.txt': b'beta'}
        self.entries = self.records(self.bodies)
        self.calls = {}
        self.responses = {}
        owner = self
        class Handler(BaseHTTPRequestHandler):
            def do_GET(self):
                path = self.path.lstrip('/')
                owner.calls[path] = owner.calls.get(path, 0) + 1
                choices = owner.responses.get(path, [200])
                status = choices[min(owner.calls[path] - 1, len(choices) - 1)]
                self.send_response(status)
                if status == 302:
                    self.send_header('Location', '/' + path + '?redirected')
                self.end_headers()
                if status == 200:
                    self.wfile.write(owner.bodies[path])
            def log_message(self, *_):
                pass
        server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        self.addCleanup(server.server_close)
        self.addCleanup(server.shutdown)
        self.m.PAGES = 'http://127.0.0.1:%d/' % server.server_port
        self.sleep = patch.object(self.m.DownloadControl, 'pause', lambda control, seconds: control.check())
        self.sleep.start()
        self.addCleanup(self.sleep.stop)

    def records(self, bodies):
        return {p: {'path': p, 'size': len(b), 'sha': self.m.git_blob_hash(b),
                    'sha256': hashlib.sha256(b).hexdigest(), 'target': 'both'}
                for p, b in bodies.items()}

    def download(self, entries=None, module=None, control=None, cache=True):
        m = module or self.m
        stage = self.root / ('stage-' + str(len(list(self.root.glob('stage-*')))))
        stage.mkdir()
        m.download_entries(entries or self.entries, stage, control or m.DownloadControl(), cache=cache)
        return stage

    def test_rounds_only_fetch_missing_and_copy_independent_files(self):
        self.responses['assets/b.txt'] = [503, 200]
        stage = self.download()
        self.assertEqual(self.calls, {'assets/a.txt': 1, 'assets/b.txt': 2})
        self.assertEqual((stage / 'assets/b.txt').read_bytes(), b'beta')
        (stage / 'assets/a.txt').write_bytes(b'edited')
        self.assertEqual((self.download() / 'assets/a.txt').read_bytes(), b'alpha')
        self.assertEqual(self.calls['assets/a.txt'], 1)

    def test_new_process_reuses_success_after_three_empty_rounds(self):
        self.responses['assets/b.txt'] = [503]
        with self.assertRaises(RuntimeError):
            self.download()
        self.assertEqual(self.calls, {'assets/a.txt': 1, 'assets/b.txt': 4})
        self.responses['assets/b.txt'] = [200]
        stage = self.root / 'process-stage'; stage.mkdir()
        code = """import importlib.util,json,sys
from pathlib import Path
spec=importlib.util.spec_from_file_location('updater',sys.argv[1])
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
m.STATE=Path(sys.argv[2]);m.PAGES=sys.argv[3]
m.download_entries(json.loads(sys.argv[4]),Path(sys.argv[5]),m.DownloadControl())
"""
        subprocess.run([sys.executable, '-c', code, str(SOURCE), str(self.m.STATE),
                        self.m.PAGES, json.dumps(self.entries), str(stage)],
                       check=True, capture_output=True, timeout=20)
        self.assertEqual((stage / 'assets/a.txt').read_bytes(), b'alpha')
        self.assertEqual(self.calls, {'assets/a.txt': 1, 'assets/b.txt': 5})

    def test_same_identity_reused_across_release_but_changed_item_redownloads(self):
        self.download()
        self.download({p: {**e, 'release': 'new-P'} for p, e in self.entries.items()})
        self.assertEqual(sum(self.calls.values()), 2)
        self.bodies['assets/a.txt'] = b'changed'
        self.download(self.records(self.bodies))
        self.assertEqual(self.calls, {'assets/a.txt': 2, 'assets/b.txt': 1})
        self.assertEqual(len(list((self.m.STATE.parent / 'download-cache-v1').iterdir())), 2)

    def test_corrupt_complete_file_redownloads_and_partial_is_removed(self):
        self.download()
        cache = self.m.STATE.parent / 'download-cache-v1'
        target = next(p for p in cache.iterdir() if p.read_bytes() == b'alpha')
        target.write_bytes(b'partial')
        partial = cache / ('.download-' + 'a' * 64 + '-123.tmp')
        partial.write_bytes(b'half')
        partial.chmod(0o600)
        self.download()
        self.assertEqual(self.calls, {'assets/a.txt': 2, 'assets/b.txt': 1})
        self.assertFalse(partial.exists())

    def test_symlink_root_or_entry_and_unknown_items_are_preserved_and_rejected(self):
        self.download()
        cache = self.m.STATE.parent / 'download-cache-v1'
        target = next(cache.iterdir()); original = target.read_bytes()
        outside = self.root / 'outside'; outside.write_bytes(original)
        target.unlink(); os.symlink(outside, target)
        with self.assertRaises(ValueError): self.download()
        self.assertTrue(target.is_symlink())
        target.unlink(); target.write_bytes(original); target.chmod(0o600)
        unknown = cache / 'unknown'; unknown.write_bytes(b'keep')
        with self.assertRaises(ValueError): self.download()
        self.assertEqual(unknown.read_bytes(), b'keep')
        unknown.unlink()
        moved = self.root / 'moved'; cache.rename(moved)
        os.symlink(moved, cache, target_is_directory=True)
        with self.assertRaises(ValueError): self.download()

    @unittest.skipIf(os.name == 'nt', 'POSIX permission bits require Linux')
    def test_cache_permissions_must_be_private(self):
        self.download()
        cache = self.m.STATE.parent / 'download-cache-v1'
        self.assertEqual(cache.stat().st_mode & 0o777, 0o700)
        target = next(cache.iterdir())
        self.assertEqual(target.stat().st_mode & 0o777, 0o600)
        target.chmod(0o644)
        with self.assertRaises(ValueError): self.download()

    def test_permission_validation_rejects_nonprivate_posix_modes(self):
        from types import SimpleNamespace
        self.download()
        cache = self.m.STATE.parent / 'download-cache-v1'
        target = next(cache.iterdir())
        # Exercise the POSIX policy against real files on Windows as well.
        policy_os = SimpleNamespace(name='posix', geteuid=lambda: target.stat().st_uid)
        with patch.object(self.m, 'os', policy_os), patch.object(self.m.stat, 'S_IMODE', return_value=0o644):
            with self.assertRaises(ValueError): self.m.private_cache_entry(target)
        with patch.object(self.m, 'os', policy_os), patch.object(self.m.stat, 'S_IMODE', return_value=0o755):
            with self.assertRaises(ValueError): self.m.private_cache_entry(cache, directory=True)

    def test_permanent_http_redirect_or_bad_digest_never_retries(self):
        for status in (404, 403, 302):
            with self.subTest(status=status):
                self.calls.clear(); self.responses['assets/a.txt'] = [status]
                with self.assertRaises(Exception):
                    self.download({'assets/a.txt': self.entries['assets/a.txt']}, cache=False)
                self.assertEqual(self.calls, {'assets/a.txt': 1})
        self.calls.clear(); self.responses.clear()
        self.bodies['assets/a.txt'] = b'wrong'
        with self.assertRaises(ValueError):
            self.download({'assets/a.txt': self.entries['assets/a.txt']})
        self.assertEqual(self.calls, {'assets/a.txt': 1})

    def test_budget_cancel_capacity_and_read_only_never_seed_cache(self):
        expired = self.m.DownloadControl(deadline=self.m.time.monotonic() - 1)
        with self.assertRaises(RuntimeError): self.download(control=expired)
        stopped = self.m.DownloadControl(); stopped.stop.set()
        with self.assertRaises(RuntimeError): self.download(control=stopped)
        with patch.object(self.m, 'MAX_TOTAL_BYTES', 3), self.assertRaises(ValueError):
            self.download()
        self.assertEqual(self.calls, {})
        self.assertFalse(self.m.STATE.parent.exists())
        self.download(cache=False)
        self.download(cache=False)
        self.assertEqual(self.calls, {'assets/a.txt': 2, 'assets/b.txt': 2})
        self.assertFalse(self.m.STATE.parent.exists())

    def test_transient_classification_does_not_retry_certificate_or_unknown_network(self):
        self.assertTrue(self.m.transient_download_error(TimeoutError()))
        self.assertTrue(self.m.transient_download_error(ConnectionResetError()))
        self.assertTrue(self.m.transient_download_error(self.m.urllib.error.URLError(socket.timeout())))
        self.assertFalse(self.m.transient_download_error(self.m.urllib.error.URLError(ssl.SSLCertVerificationError())))
        self.assertFalse(self.m.transient_download_error(self.m.urllib.error.URLError('unknown')))

    def test_five_round_limit_even_with_progress(self):
        self.bodies = {'assets/%d.txt' % n: str(n).encode() for n in range(1, 7)}
        self.entries = self.records(self.bodies)
        self.responses = {p: [503] * (n - 1) + [200]
                          for n, p in enumerate(self.bodies, 1)}
        with self.assertRaises(RuntimeError): self.download()
        self.assertEqual(self.calls, {'assets/%d.txt' % n: min(n, 5) for n in range(1, 7)})
        self.assertEqual(len(list((self.m.STATE.parent / 'download-cache-v1').iterdir())), 5)

    def test_read_only_ignores_poisoned_cache_and_checks_pages(self):
        self.download()
        cache = self.m.STATE.parent / 'download-cache-v1'
        (cache / 'unknown').write_bytes(b'keep')
        before = {p.name: p.read_bytes() for p in cache.iterdir()}
        self.bodies['assets/a.txt'] = b'wrong'
        with self.assertRaises(ValueError): self.download(cache=False)
        self.assertEqual({p.name: p.read_bytes() for p in cache.iterdir()}, before)

    def test_pages_only_is_verified_and_cached_without_stage_file(self):
        path = 'design-preview/index.html'; self.bodies[path] = b'<html>preview</html>'
        entries = self.records({path: self.bodies[path]})
        entries[path]['target'] = 'pages-only'
        stage = self.download(entries)
        self.assertEqual(list(stage.iterdir()), [])
        self.download(entries)
        self.assertEqual(self.calls, {path: 1})

    def test_cancel_stops_new_tasks_retains_completed_cache_and_next_run_resumes(self):
        path = 'assets/a.txt'
        entries = {path: self.entries[path]}
        control = self.m.DownloadControl()
        fetch = self.m.fetch_one
        def cancel_after_response(*args, **kwargs):
            body = fetch(*args, **kwargs)
            control.stop.set()
            return body
        with patch.object(self.m, 'fetch_one', side_effect=cancel_after_response), self.assertRaises(RuntimeError):
            self.download(entries, control=control)
        self.assertEqual(len(list((self.m.STATE.parent / 'download-cache-v1').iterdir())), 1)
        self.assertEqual((self.download(entries) / path).read_bytes(), b'alpha')
        self.assertEqual(self.calls, {path: 1})


if __name__ == '__main__':
    unittest.main()
