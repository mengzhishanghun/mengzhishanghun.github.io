import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
// The retired local synchronizer's private manifest is no longer an input.
// Exercise current import and public build rejection gates in isolated fixtures.
const result=spawnSync(process.execPath,['--test',path.join(here,'projection.test.mjs'),path.resolve(here,'../site-build/build.test.mjs'),path.resolve(here,'../site-build/media.test.mjs')],{stdio:'inherit'});
process.exitCode=result.status || 0;
