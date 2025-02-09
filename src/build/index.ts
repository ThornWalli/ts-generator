import { Configuration } from './../types';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { build } from './utils/index.ts';
import consola from 'consola';
import { join } from 'path';

const fixture = process.env.npm_config_fixture || 'default';
const config: Configuration = (await readFile(`test/fixtures/${fixture}/config.json`, 'utf-8').then(
  JSON.parse
)) as Configuration;

const result = build(config);

const dist = join('.output', fixture);
await mkdir(dist, { recursive: true });
await writeFile(join(dist, 'index.ts'), result);

consola.success('done!');
