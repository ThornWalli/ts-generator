import { mkdir, readFile, writeFile } from 'fs/promises';
import consola from 'consola';
import { join } from 'path';

import { Configuration } from './types.ts';
import build from './build/index.ts';
import { getFixture } from './utils.ts';

const fixture = getFixture();
const config: Configuration = (await readFile(`test/fixtures/${fixture}/config.json`, 'utf-8').then(
  JSON.parse
)) as Configuration;

const result = build(config);

const dist = join('.output', fixture);
await mkdir(dist, { recursive: true });
await writeFile(join(dist, 'index.ts'), result);

consola.success('done!');
