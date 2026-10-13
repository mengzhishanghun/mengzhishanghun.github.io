#!/usr/bin/env python3
"""Update mzsh.me from matching public GitHub refs and verified Pages bytes."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path, PurePosixPath
import base64
import binascii
import hashlib
import json
import os
import re
import shutil
import stat
import subprocess
import sys
import time
import urllib.parse
import urllib.request

REPO = 'mengzhishanghun/mengzhishanghun.github.io'
API = f'https://api.github.com/repos/{REPO}'
PAGES = 'https://mengzhishanghun.github.io/'
ROOT = Path('/srv/www/mzsh-releases')
POINTER = Path('/srv/www/mzsh-current')
CONFIG = Path('/etc/caddy/Caddyfile')
STATE = Path('/var/lib/mzsh-static-update/state.json')
ASTRO_ARCHIVE = Path('/srv/www/mzsh-astro-archive')
ASTRO_MANIFEST = ASTRO_ARCHIVE / 'manifest.json'
HISTORIC_RELEASES = (
    '15bc29fabccecfbe7fb6d7a40e386998d29c55d1',
    '3783830e71d4497fcc641d42f7df01ea86994573',
    '17cdb66eb57cbcb9f5876a9460d6c7ff36576626',
    '0e41193c948f536a835926227b3b3dd64a4798c6',
    'e2057c0d1e29f4b3a536e6ad386b734fc3a323a6',
    'f66fb4220d002cd1b31e0431c2bb0632bdddf068',
    '42b05b0316973edf47b519b3cd77b86700f4366c',
)
HASHED_ASTRO = re.compile(r'(?:docs/)?_astro/[^/]+\.[A-Za-z0-9_-]{8}\.(?:css|js)\Z')
REQUIRED = {'index.html', 'works/index.html', 'cases/index.html', 'blog/index.html',
            'contact/index.html', 'support/index.html', 'blog/cnblogs-19143258/index.html'}
ALLOWED_SUFFIX = {'.html', '.css', '.js', '.json', '.xml', '.svg', '.png', '.jpg',
                  '.jpeg', '.webp', '.ico', '.txt', '.pagefind', '.pf_fragment',
                  '.pf_index', '.pf_meta'}
SKIP = {'.nojekyll'}
PUBLIC_ROOTS = {'_astro', 'assets', 'blog-search', 'blog', 'cases', 'contact', 'docs',
                'en', 'licenses', 'media', 'support', 'works', 'zh'}
PUBLIC_ROOT_FILES = {'.nojekyll', 'favicon.svg', 'index.html', 'site-router.js',
                     'sitemap.xml', 'robots.txt', 'site-languages.json', 'about/index.html'}
PRIVATE_ROOTS = {'src', 'tools', 'content', 'ob', 'obsidian', 'website-next'}
MAX_LANGUAGES = 32
MAX_TOTAL_BYTES = 150_000_000
REGISTRY_LIMIT = 64_000
USER_AGENT = 'mzsh-static-update/1.0 (public repository read only)'
LEGACY_BASELINE_SHA = 'c0b7e4fbf4a30c0c8eb968256225ad4f99b25de8'
RELEASE_MANIFEST_PATH = 'src/deploy/release-manifest.json'
PROVENANCE_PATH = 'release-provenance.json'
PAGES_ONLY = {'design-preview/index.html', 'design-preview/docs/index.html'}
MANIFEST_LIMIT = 8 * 1024 * 1024
PROVENANCE_LIMIT = 4096

def say(*items):
    print(*items, flush=True)

def request(url, limit=2_000_000, retries=3):
    last = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT,
                                                        'Accept-Encoding': 'identity'})
            with urllib.request.urlopen(req, timeout=20) as response:
                final = urllib.parse.urlsplit(response.geturl())
                allowed = urllib.parse.urlsplit(url).hostname
                if final.hostname != allowed or response.status != 200:
                    raise ValueError(f'unexpected response destination/status: {final.hostname} {response.status}')
                body = response.read(limit + 1)
                if len(body) > limit:
                    raise ValueError('response size limit exceeded')
                return body
        except Exception as exc:
            last = exc
            if attempt + 1 < retries:
                time.sleep(2 + attempt * 3)
    raise RuntimeError(f'read failed: {url}: {last}')

def api(path):
    limit = MANIFEST_LIMIT * 2 + 4096 if path.startswith('/git/blobs/') else 2_000_000
    return json.loads(request(API + path, limit=limit).decode('utf-8'))

def state_read():
    if STATE.exists():
        return json.loads(STATE.read_text(encoding='utf-8'))
    return {}

def state_write(data):
    STATE.parent.mkdir(mode=0o755, parents=True, exist_ok=True)
    temp = STATE.with_name('.state.json.tmp')
    temp.write_text(json.dumps(data, sort_keys=True) + '\n', encoding='utf-8')
    os.replace(temp, STATE)

def git_blob_hash(data):
    return hashlib.sha1(f'blob {len(data)}\0'.encode() + data).hexdigest()

def regular_bytes(path, limit=5_000_000):
    if path.is_symlink() or not stat.S_ISREG(path.stat(follow_symlinks=False).st_mode):
        raise ValueError(f'nonregular asset: {path}')
    if path.stat().st_size > limit:
        raise ValueError(f'oversize asset: {path}')
    return path.read_bytes()

def archive_path(path):
    if not HASHED_ASTRO.fullmatch(path):
        raise ValueError(f'invalid hashed asset path: {path}')
    if any((ASTRO_ARCHIVE / part).is_symlink()
           for part in ('.', '_astro', 'docs', 'docs/_astro')):
        raise ValueError('archive symlink')
    return ASTRO_ARCHIVE / path

def archive_read():
    if not ASTRO_MANIFEST.is_file() or ASTRO_MANIFEST.is_symlink():
        raise ValueError('trusted asset archive missing')
    data = json.loads(ASTRO_MANIFEST.read_text(encoding='utf-8'))
    files = data.get('files')
    if data.get('version') != 1 or not isinstance(files, dict) or len(files) > 500:
        raise ValueError('invalid trusted asset manifest')
    total = 0
    for path, record in files.items():
        source = archive_path(path)
        body = regular_bytes(source)
        total += len(body)
        if (len(body) != record['size'] or hashlib.sha256(body).hexdigest() != record['sha256']
                or git_blob_hash(body) != record['blob']):
            raise ValueError(f'trusted asset hash mismatch: {path}')
    if total > 50_000_000:
        raise ValueError('trusted asset archive size exceeded')
    return data

def archive_write(data):
    ASTRO_ARCHIVE.mkdir(mode=0o755, parents=True, exist_ok=True)
    (ASTRO_ARCHIVE / '_astro').mkdir(mode=0o755, exist_ok=True)
    temp = ASTRO_MANIFEST.with_name(f'.manifest-{os.getpid()}.tmp')
    temp.write_text(json.dumps(data, sort_keys=True, separators=(',', ':')) + '\n', encoding='utf-8')
    os.replace(temp, ASTRO_MANIFEST)

def archive_add_one(manifest, path, body, blob, source_sha):
    if not HASHED_ASTRO.fullmatch(path) or len(body) > 5_000_000 or git_blob_hash(body) != blob:
        raise ValueError(f'untrusted hashed asset: {path}')
    record = {'sha256': hashlib.sha256(body).hexdigest(), 'blob': blob,
              'size': len(body), 'source_sha': source_sha}
    previous = manifest['files'].get(path)
    if previous is not None:
        if any(previous[k] != record[k] for k in ('sha256', 'blob', 'size')):
            raise ValueError(f'hashed asset name collision: {path}')
        if regular_bytes(archive_path(path)) != body:
            raise ValueError(f'archive bytes differ: {path}')
        return
    target = archive_path(path)
    if target.exists() or target.is_symlink():
        raise ValueError(f'unmanifested archive entry: {path}')
    target.parent.mkdir(mode=0o755, parents=True, exist_ok=True)
    temp = target.with_name(f'.{target.name}.{os.getpid()}.tmp')
    try:
        temp.write_bytes(body)
        os.replace(temp, target)
    finally:
        temp.unlink(missing_ok=True)
    manifest['files'][path] = record

def bootstrap_archive():
    if ASTRO_MANIFEST.exists() or ASTRO_MANIFEST.is_symlink():
        raise ValueError('archive already initialized')
    if ASTRO_ARCHIVE.exists() and (ASTRO_ARCHIVE.is_symlink()
                                   or any(ASTRO_ARCHIVE.iterdir())):
        raise ValueError('archive directory not empty')
    verified = []
    for sha in HISTORIC_RELEASES:
        source = ROOT / sha
        if source.is_symlink() or not source.is_dir() or (source / '_astro').is_symlink():
            raise ValueError(f'historical release missing: {sha}')
        entries = tree_for(sha, history=True)
        for path, item in entries.items():
            if HASHED_ASTRO.fullmatch(path):
                body = regular_bytes(source / path)
                if git_blob_hash(body) != item['sha']:
                    raise ValueError(f'historical Git blob mismatch: {path} at {sha}')
                verified.append((path, body, item['sha'], sha))
    ASTRO_ARCHIVE.mkdir(mode=0o755, parents=True, exist_ok=True)
    (ASTRO_ARCHIVE / '_astro').mkdir(mode=0o755, exist_ok=True)
    manifest = {'version': 1, 'files': {}}
    try:
        for path, body, blob, sha in verified:
            archive_add_one(manifest, path, body, blob, sha)
        archive_write(manifest)
    except Exception:
        if not ASTRO_ARCHIVE.is_symlink() and not ASTRO_MANIFEST.exists():
            shutil.rmtree(ASTRO_ARCHIVE)
        raise
    say('trusted historical hashed assets', len(manifest['files']))

def backfill_archive(manifest):
    before = len(manifest['files'])
    verified = []
    for sha in HISTORIC_RELEASES:
        source = ROOT / sha
        if source.is_symlink() or not source.is_dir() or (source / 'docs' / '_astro').is_symlink():
            raise ValueError(f'historical docs release missing: {sha}')
        entries = tree_for(sha, history=True)
        for path, item in entries.items():
            if HASHED_ASTRO.fullmatch(path):
                body = regular_bytes(source / path)
                if git_blob_hash(body) != item['sha']:
                    raise ValueError(f'historical Git blob mismatch: {path} at {sha}')
                verified.append((path, body, item['sha'], sha))
    for path, body, blob, sha in verified:
        archive_add_one(manifest, path, body, blob, sha)
    if len(manifest['files']) != before:
        archive_write(manifest)
    say('trusted historical hashed assets', len(manifest['files']))

def add_current_assets(manifest, entries, stage, source_sha):
    before = len(manifest['files'])
    for path, item in entries.items():
        if HASHED_ASTRO.fullmatch(path):
            archive_add_one(manifest, path, regular_bytes(stage / path), item['sha'], source_sha)
    if len(manifest['files']) != before:
        archive_write(manifest)

def copy_archive_to_stage(manifest, entries, stage):
    added = 0
    for path, record in manifest['files'].items():
        body = regular_bytes(archive_path(path))
        if path in entries:
            if entries[path]['sha'] != record['blob'] or regular_bytes(stage / path) != body:
                raise ValueError(f'current asset conflicts with history: {path}')
            continue
        target = stage / path
        if target.exists() or target.is_symlink():
            raise ValueError(f'staging asset collision: {path}')
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(body)
        added += 1
    return added

def verify_archive_in_release(manifest, release):
    if release.is_symlink() or not release.is_dir() or release.parent != ROOT:
        raise ValueError('active release path invalid')
    for path, record in manifest['files'].items():
        body = regular_bytes(release / path)
        if hashlib.sha256(body).hexdigest() != record['sha256']:
            raise ValueError(f'active historical asset differs: {path}')

def branch_sha(branch):
    obj = api('/git/ref/heads/' + branch)
    sha = obj['object']['sha']
    if obj['object']['type'] != 'commit' or not re.fullmatch('[0-9a-f]{40}', sha):
        raise ValueError('invalid branch ref')
    return sha

def public_language_codes(config):
    if (not isinstance(config, dict) or type(config.get('version')) is not int
            or config['version'] != 1
            or set(config) != {'version', 'primary', 'fallback', 'languages'}):
        raise ValueError('invalid public language registry')
    languages = config['languages']
    if not isinstance(languages, list) or not 1 <= len(languages) <= MAX_LANGUAGES:
        raise ValueError('invalid enabled language count')
    codes = []
    fields = {'code', 'label', 'htmlLang', 'searchLanguage', 'browserTags'}
    for language in languages:
        if not isinstance(language, dict) or set(language) - fields:
            raise ValueError('language registry contains source fields')
        code = language.get('code')
        if (not isinstance(code, str) or not re.fullmatch(r'[a-z]{2,3}(?:-[a-z0-9]{2,8})*', code)
                or code in PRIVATE_ROOTS or code in codes):
            raise ValueError('invalid or duplicate public language code')
        if (not isinstance(language.get('label'), str) or not language['label']
                or not isinstance(language.get('browserTags'), list)
                or not all(isinstance(tag, str) for tag in language['browserTags'])):
            raise ValueError('invalid public language metadata')
        codes.append(code)
    if config['primary'] not in codes or config['fallback'] not in codes:
        raise ValueError('language primary/fallback is not enabled')
    return set(codes)


def validate_public_item(item):
    path = item['path']
    parts = path.split('/')
    if (not path or path.startswith('/') or '\\' in path or ':' in path
            or any(not part or part in ('.', '..') for part in parts)
            or any(part.startswith('.') for part in parts) and path != '.nojekyll'):
        raise ValueError(f'unsafe public path: {path}')
    if item['type'] == 'tree' and item['mode'] == '040000':
        return False
    if item['type'] != 'blob' or item['mode'] != '100644':
        raise ValueError(f'nonregular public entry: {path}')
    size = item.get('size', -1)
    if type(size) is not int or not 0 <= size <= 50_000_000:
        raise ValueError(f'invalid public file size: {path}')
    if PurePosixPath(path).suffix.lower() not in ALLOWED_SUFFIX and path not in PUBLIC_ROOT_FILES:
        raise ValueError(f'unexpected public file type: {path}')
    if any(term in path.lower() for term in ('.openai', '.env', 'private', 'audit', 'source.zip')):
        raise ValueError(f'private-looking public path: {path}')
    if not isinstance(item.get('sha'), str) or not re.fullmatch('[0-9a-f]{40}', item['sha']):
        raise ValueError(f'invalid public blob identity: {path}')
    return True


def tree_for(sha, *, history=False):
    if history and sha not in HISTORIC_RELEASES:
        raise ValueError('history mode requires a fixed historical SHA')
    commit = api('/git/commits/' + sha)
    if commit['sha'] != sha:
        raise ValueError('commit identity mismatch')
    tree_sha = commit['tree']['sha']
    result = api('/git/trees/' + tree_sha + '?recursive=1')
    if result['sha'] != tree_sha or result.get('truncated'):
        raise ValueError('tree unavailable or truncated')
    registry_items = [item for item in result['tree'] if item['path'] == 'site-languages.json']
    if len(registry_items) > 1:
        raise ValueError('duplicate language registry')
    if registry_items:
        item = registry_items[0]
        if not validate_public_item(item) or item['size'] > REGISTRY_LIMIT:
            raise ValueError('invalid language registry blob')
        blob = api('/git/blobs/' + item['sha'])
        if (not isinstance(blob, dict) or blob.get('sha') != item['sha']
                or type(blob.get('size')) is not int or blob['size'] != item['size']
                or blob.get('encoding') != 'base64' or not isinstance(blob.get('content'), str)):
            raise ValueError('invalid language registry API blob')
        encoded_limit = 4 * ((REGISTRY_LIMIT + 2) // 3)
        if len(blob['content']) > encoded_limit * 2:
            raise ValueError('language registry encoded size limit exceeded')
        content = blob['content'].replace('\r', '').replace('\n', '')
        if len(content) > encoded_limit:
            raise ValueError('language registry encoded size limit exceeded')
        try:
            body = base64.b64decode(content.encode('ascii'), validate=True)
        except (UnicodeError, binascii.Error) as exc:
            raise ValueError('language registry is not strict ASCII base64') from exc
        if len(body) > REGISTRY_LIMIT:
            raise ValueError('language registry decoded size limit exceeded')
        if len(body) != item['size'] or git_blob_hash(body) != item['sha']:
            raise ValueError('language registry differs from commit blob')
        try:
            codes = public_language_codes(json.loads(body.decode('utf-8')))
        except (UnicodeError, json.JSONDecodeError) as exc:
            raise ValueError('language registry is not valid UTF-8 JSON') from exc
    elif history:
        codes = {'zh', 'en'}
    else:
        raise ValueError('current commit is missing site-languages.json')
    roots = PUBLIC_ROOTS | codes
    entries = {}
    total = 0
    for item in result['tree']:
        path = item['path']
        # 私有/源码树不参与公开容量与类型门禁；可疑公开路径仍按原值拒绝。
        candidate_root = path.replace('\\', '/').lstrip('/').split('/')[0]
        if path not in PUBLIC_ROOT_FILES and candidate_root not in roots:
            continue
        if not validate_public_item(item):
            continue
        if path in entries:
            raise ValueError(f'duplicate public path: {path}')
        entries[path] = item
        total += item['size']
    html_limit = 300 if history else 200 + 110 * len(codes)
    file_limit = 800 if history else 1000 + 500 * len(codes)
    if not REQUIRED.issubset(entries) or not 100 <= sum(p.endswith('.html') for p in entries) <= html_limit:
        raise ValueError('critical pages missing or HTML capacity exceeded')
    if not 100 <= len(entries) <= file_limit or total > MAX_TOTAL_BYTES or not any(p.startswith('_astro/') for p in entries):
        raise ValueError('public tree size or assets invalid')
    return entries


def fetch_one(pair, stage=None):
    path, item = pair
    url = PAGES + urllib.parse.quote(path, safe='/')
    body = request(url, limit=item['size'] + 1)
    if len(body) != item['size'] or git_blob_hash(body) != item['sha']:
        raise ValueError(f'Pages content differs from commit: {path}')
    if 'sha256' in item and hashlib.sha256(body).hexdigest() != item['sha256']:
        raise ValueError(f'Pages content differs from source manifest: {path}')
    if path in REQUIRED and b'<html' not in body.lower():
        raise ValueError(f'HTML page invalid: {path}')
    if path == 'index.html' and b'https://mzsh.me' not in body:
        raise ValueError('site origin invalid')
    if stage is not None:
        output = stage / path
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_bytes(body)
    return body


def strict_json(body):
    def unique(pairs):
        obj = {}
        for key, value in pairs:
            if key in obj:
                raise ValueError('duplicate JSON field')
            obj[key] = value
        return obj
    try:
        return json.loads(body.decode('utf-8'), object_pairs_hook=unique,
                          parse_constant=lambda _: (_ for _ in ()).throw(ValueError('nonfinite JSON')))
    except (UnicodeError, json.JSONDecodeError) as exc:
        raise ValueError('invalid release UTF-8 JSON') from exc


def raw_tree(sha):
    if not isinstance(sha, str) or not re.fullmatch('[0-9a-f]{40}', sha):
        raise ValueError('invalid release commit')
    commit = api('/git/commits/' + sha)
    if commit.get('sha') != sha or not re.fullmatch('[0-9a-f]{40}', commit.get('tree', {}).get('sha', '')):
        raise ValueError('release commit identity mismatch')
    tree_sha = commit['tree']['sha']
    tree = api('/git/trees/' + tree_sha + '?recursive=1')
    if tree.get('sha') != tree_sha or tree.get('truncated') or not isinstance(tree.get('tree'), list):
        raise ValueError('release tree unavailable or truncated')
    items = {}
    for item in tree['tree']:
        if not isinstance(item, dict) or not isinstance(item.get('path'), str) or item['path'] in items:
            raise ValueError('invalid or duplicate release tree path')
        items[item['path']] = item
    return items


def strict_blob(item, limit):
    if (item.get('type') != 'blob' or item.get('mode') != '100644'
            or type(item.get('size')) is not int or not 0 <= item['size'] <= limit
            or not isinstance(item.get('sha'), str) or not re.fullmatch('[0-9a-f]{40}', item['sha'])):
        raise ValueError('invalid release metadata blob')
    blob = api('/git/blobs/' + item['sha'])
    if (not isinstance(blob, dict) or blob.get('sha') != item['sha']
            or type(blob.get('size')) is not int or blob['size'] != item['size']
            or blob.get('encoding') != 'base64' or not isinstance(blob.get('content'), str)):
        raise ValueError('invalid release API blob')
    encoded_limit = 4 * ((limit + 2) // 3)
    if len(blob['content']) > encoded_limit * 2:
        raise ValueError('release encoded size limit exceeded')
    content = blob['content'].replace('\r', '').replace('\n', '')
    if len(content) > encoded_limit:
        raise ValueError('release encoded size limit exceeded')
    try:
        body = base64.b64decode(content.encode('ascii'), validate=True)
    except (UnicodeError, binascii.Error) as exc:
        raise ValueError('release metadata is not strict base64') from exc
    if len(body) > limit or len(body) != item['size'] or git_blob_hash(body) != item['sha']:
        raise ValueError('release metadata differs from commit blob')
    return body


def release_entries(source_sha, artifact_sha):
    artifact = raw_tree(artifact_sha)
    if PROVENANCE_PATH not in artifact:
        if source_sha == artifact_sha == LEGACY_BASELINE_SHA:
            return tree_for(artifact_sha)
        raise ValueError('release provenance missing outside exact legacy baseline')
    provenance_bytes = strict_blob(artifact[PROVENANCE_PATH], PROVENANCE_LIMIT)
    provenance = strict_json(provenance_bytes)
    if (not isinstance(provenance, dict)
            or set(provenance) != {'version', 'sourceCommit', 'manifestPath', 'manifestSha256'}
            or type(provenance['version']) is not int or provenance['version'] != 1
            or provenance['sourceCommit'] != source_sha
            or not isinstance(provenance['sourceCommit'], str)
            or not re.fullmatch('[0-9a-f]{40}', provenance['sourceCommit'])
            or provenance['manifestPath'] != RELEASE_MANIFEST_PATH
            or not isinstance(provenance['manifestSha256'], str)
            or not re.fullmatch('[0-9a-f]{64}', provenance['manifestSha256'])):
        raise ValueError('release source binding invalid')
    source = raw_tree(source_sha)
    if RELEASE_MANIFEST_PATH not in source:
        raise ValueError('source release manifest missing')
    manifest_bytes = strict_blob(source[RELEASE_MANIFEST_PATH], MANIFEST_LIMIT)
    if hashlib.sha256(manifest_bytes).hexdigest() != provenance['manifestSha256']:
        raise ValueError('source release manifest digest mismatch')
    manifest = strict_json(manifest_bytes)
    if (not isinstance(manifest, dict) or set(manifest) != {'version', 'files'}
            or type(manifest['version']) is not int or manifest['version'] != 1
            or not isinstance(manifest['files'], list) or not manifest['files']
            or len(manifest['files']) > 1000 + 500 * MAX_LANGUAGES + len(PAGES_ONLY)):
        raise ValueError('source release manifest invalid')
    records = {}; previous = ''; total = 0
    for record in manifest['files']:
        if (not isinstance(record, dict)
                or set(record) != {'path', 'size', 'gitBlob', 'sha256', 'target'}
                or not isinstance(record['path'], str) or record['path'] <= previous
                or type(record['size']) is not int or not 0 <= record['size'] <= 50_000_000
                or not isinstance(record['gitBlob'], str) or not re.fullmatch('[0-9a-f]{40}', record['gitBlob'])
                or not isinstance(record['sha256'], str) or not re.fullmatch('[0-9a-f]{64}', record['sha256'])
                or record['target'] not in ('both', 'pages-only')
                or (record['path'] in PAGES_ONLY) != (record['target'] == 'pages-only')):
            raise ValueError('invalid, duplicate or unsorted release record')
        path = record['path']; previous = path
        item = artifact.get(path)
        if (not item or item.get('type') != 'blob' or item.get('mode') != '100644'
                or type(item.get('size')) is not int or item['size'] != record['size']
                or item.get('sha') != record['gitBlob']):
            raise ValueError('artifact tree differs from source manifest')
        validate_public_item(item)
        if path in SKIP:
            body = strict_blob(item, record['size'])
            if hashlib.sha256(body).hexdigest() != record['sha256']:
                raise ValueError('skipped artifact differs from source manifest')
        total += record['size']
        records[path] = {**item, 'target': record['target'], 'sha256': record['sha256']}
    if total > MAX_TOTAL_BYTES:
        raise ValueError('release total size exceeded')
    expected = set(records) | {PROVENANCE_PATH}
    actual = {p for p, item in artifact.items() if item.get('type') != 'tree'}
    parents = {str(parent) for p in expected for parent in PurePosixPath(p).parents if str(parent) != '.'}
    if actual != expected:
        raise ValueError('artifact file set differs from source manifest')
    if any(item.get('type') == 'tree' and (item.get('mode') != '040000' or p not in parents)
           for p, item in artifact.items()):
        raise ValueError('unexpected artifact directory')
    public = tree_for(artifact_sha)
    if set(public) != {p for p, r in records.items() if r['target'] == 'both'}:
        raise ValueError('source manifest contains nonpublic files')
    records[PROVENANCE_PATH] = {**artifact[PROVENANCE_PATH], 'target': 'metadata',
                                'sha256': hashlib.sha256(provenance_bytes).hexdigest()}
    return records


def deployable(path, item):
    return path not in SKIP and item.get('target', 'both') == 'both'


def assert_refs(source_sha, artifact_sha):
    if branch_sha('main') != source_sha or branch_sha('production-static') != artifact_sha:
        raise ValueError('release refs changed during verification')

def validate_caddy():
    data = CONFIG.read_bytes()
    if data.count(b'\troot * /srv/www/mzsh-current\n') != 1:
        raise ValueError('mzsh.me pointer is no longer the unique Caddy root')
    subprocess.run(['caddy', 'validate', '--config', str(CONFIG), '--adapter', 'caddyfile'],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=30)
    return hashlib.sha256(data).hexdigest()

def health(expected_home_sha):
    p = subprocess.run(['curl', '--fail', '--silent', '--show-error', '--max-time', '15',
                        '--resolve', 'mzsh.me:443:127.0.0.1', 'https://mzsh.me/index.html'],
                       check=True, capture_output=True, timeout=20)
    if git_blob_hash(p.stdout) != expected_home_sha:
        raise ValueError('local HTTPS content does not match commit')

def main():
    check = sys.argv[1:] in (['--check'], ['--preflight'])
    repair_current = sys.argv[1:] == ['--repair-current']
    refresh_current = sys.argv[1:] == ['--refresh-current']
    if sys.argv[1:] and not (check or repair_current or refresh_current):
        raise ValueError('unsupported mode')
    config_hash = validate_caddy()
    static_sha = branch_sha('production-static')
    state = state_read()
    main_sha = branch_sha('main')
    entries = release_entries(main_sha, static_sha)
    deployed_count = sum(deployable(p, e) for p, e in entries.items())
    if state.get('failed_sha') == static_sha and state.get('failures', 0) >= 3:
        raise ValueError(f'SHA blocked after three failures: {static_sha}')
    if check:
        manifest = archive_read()
        active = POINTER.resolve() if POINTER.is_symlink() else None
        if active is None or not active.is_dir() or active.parent != ROOT:
            raise ValueError('active release pointer invalid')
        verify_archive_in_release(manifest, active)
        with ThreadPoolExecutor(max_workers=6) as pool:
            list(pool.map(fetch_one, ((p, e) for p, e in entries.items() if p not in SKIP)))
        if POINTER.resolve() != active or hashlib.sha256(CONFIG.read_bytes()).hexdigest() != config_hash:
            raise ValueError('production pointer or Caddyfile changed during preflight')
        assert_refs(main_sha, static_sha)
        say('preflight passed', static_sha, 'public files', len(entries) - len(SKIP & entries.keys()))
        return
    if repair_current and not ASTRO_MANIFEST.exists():
        bootstrap_archive()
    manifest = archive_read()
    if refresh_current:
        backfill_archive(manifest)
    if state.get('failed_sha') == static_sha and state.get('failures', 0) >= 3:
        raise ValueError(f'SHA blocked after three failures: {static_sha}')
    active = POINTER.resolve() if POINTER.is_symlink() else None
    if active and active.name in (static_sha, static_sha + '-compat', static_sha + '-compat2') and not (
            (repair_current and active.name == static_sha)
            or (refresh_current and active.name == static_sha + '-compat')):
        verify_archive_in_release(manifest, active)
        home = regular_bytes(active / 'index.html', limit=10_000_000)
        health(git_blob_hash(home))
        assert_refs(main_sha, static_sha)
        state.update({'last_sha': static_sha})
        state_write(state)
        say('no change; live SHA', static_sha, 'HTTPS healthy')
        return
    try:
        release = ROOT / (static_sha + '-compat2' if refresh_current
                          else static_sha + '-compat' if repair_current else static_sha)
        if release.exists():
            raise ValueError('release path already exists and is not active')
        stage = ROOT / f'.staging-{static_sha}-{os.getpid()}'
        stage.mkdir(mode=0o755, parents=True)
        try:
            with ThreadPoolExecutor(max_workers=6) as pool:
                list(pool.map(lambda pair: fetch_one(pair, stage if deployable(*pair) else None),
                              ((p, e) for p, e in entries.items() if p not in SKIP)))
            if sum(p.is_file() for p in stage.rglob('*')) != deployed_count:
                raise ValueError('staging file count mismatch')
            add_current_assets(manifest, entries, stage, static_sha)
            added = copy_archive_to_stage(manifest, entries, stage)
            if sum(p.is_file() for p in stage.rglob('*')) != deployed_count + added:
                raise ValueError('staging historical asset count mismatch')
            verify_archive_in_release(manifest, stage)
            if hashlib.sha256(CONFIG.read_bytes()).hexdigest() != config_hash:
                raise ValueError('Caddyfile changed during staging')
            os.replace(stage, release)
        finally:
            if stage.exists():
                shutil.rmtree(stage)
        old_target = POINTER.resolve() if POINTER.is_symlink() else None
        if old_target is None or not old_target.is_dir():
            raise ValueError('old release pointer missing')
        temp = POINTER.with_name(f'.mzsh-current-{os.getpid()}')
        os.symlink(release, temp)
        try:
            validate_caddy()
            if POINTER.resolve() != old_target or hashlib.sha256(CONFIG.read_bytes()).hexdigest() != config_hash:
                raise ValueError('production pointer or Caddyfile changed before switch')
            assert_refs(main_sha, static_sha)
            os.replace(temp, POINTER)
            try:
                subprocess.run(['systemctl', 'reload', 'caddy'], check=True, timeout=30)
                health(entries['index.html']['sha'])
            except Exception:
                if POINTER.is_symlink() and POINTER.resolve() == release:
                    rollback = POINTER.with_name(f'.mzsh-rollback-{os.getpid()}')
                    os.symlink(old_target, rollback)
                    os.replace(rollback, POINTER)
                    subprocess.run(['systemctl', 'reload', 'caddy'], check=True, timeout=30)
                raise
        finally:
            temp.unlink(missing_ok=True)
        state_write({'last_sha': static_sha, 'failed_sha': None, 'failures': 0})
        say('deployed', static_sha, 'files', deployed_count,
            'historical_assets', added, 'previous', old_target)
    except Exception:
        count = state.get('failures', 0) + 1 if state.get('failed_sha') == static_sha else 1
        state.update({'failed_sha': static_sha, 'failures': count})
        state_write(state)
        raise

if __name__ == '__main__':
    try:
        main()
    except Exception as exc:
        say('update failed:', type(exc).__name__, exc)
        sys.exit(1)
