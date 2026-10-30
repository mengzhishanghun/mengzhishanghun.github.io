"""视频发布类型与文件签名门禁。"""
import hashlib
import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('media_update', Path(__file__).resolve().parents[1] / 'mzsh-static-update.py')
update = importlib.util.module_from_spec(spec)
spec.loader.exec_module(update)

class VideoPublication(unittest.TestCase):
    def test_exact_video_bytes_pass_both_gates_and_spoofed_bytes_fail(self):
        for name, body in [('demo.mp4', bytes((0, 0, 0, 24)) + b'ftypisom' + bytes(16)), ('demo.webm', bytes((0x1a, 0x45, 0xdf, 0xa3)) + b'webm' + bytes(8))]:
            path = 'media/' + name
            item = {'path': path, 'mode': '100644', 'type': 'blob', 'size': len(body), 'sha': update.git_blob_hash(body), 'sha256': hashlib.sha256(body).hexdigest()}
            self.assertTrue(update.validate_public_item(item))
            update.validate_download(path, item, body)
            bad = b'fake video bytes'
            item.update(size=len(bad), sha=update.git_blob_hash(bad), sha256=hashlib.sha256(bad).hexdigest())
            with self.assertRaisesRegex(ValueError, 'signature'):
                update.validate_download(path, item, bad)
