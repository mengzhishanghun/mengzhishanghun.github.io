import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { readConfig, backupDatabase } from './service.mjs';
const file = process.argv[2];
const stat = fs.lstatSync(file);
if (!stat.isFile() || stat.isSymbolicLink() || (stat.mode & 0o077)) throw new Error('Unsafe config');
const config = readConfig(file);
const directory = fs.lstatSync(config.backupDir);
if (!directory.isDirectory() || directory.isSymbolicLink() || (directory.mode & 0o077)) throw new Error('Unsafe backup directory');
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const target = path.join(config.backupDir, `counts-${stamp}-${process.pid}.sqlite`);
const db = new DatabaseSync(config.db, { readOnly: true });
try { await backupDatabase(db, target); } finally { db.close(); }
const verify = new DatabaseSync(target, { readOnly: true });
try {
  if (verify.prepare('PRAGMA integrity_check').get().integrity_check !== 'ok') throw new Error('Restore integrity check failed');
  const rows = verify.prepare('SELECT article_id,count FROM article_counts ORDER BY article_id').all();
  fs.writeFileSync(`${target}.verified.json`, JSON.stringify({rows: rows.length, count: rows.reduce((n,r)=>n+r.count,0)}), {mode:0o600,flag:'wx'});
} finally { verify.close(); }
console.log('Engagement online backup and isolated database open verified');
