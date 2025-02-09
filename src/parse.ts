import { mkdir, readFile, writeFile } from 'fs/promises';
import consola from 'consola';
import { join } from 'path';

import parse from './parse/index.ts';
import { getFixture } from './utils.ts';

const fixture = getFixture();
const fileContent = await readFile(`test/fixtures/${fixture}/index.ts`, 'utf-8');

const result = parse('index.ts', fileContent);

console.debug('imports:', JSON.stringify(result.imports, null, 2));
console.debug('operators:', JSON.stringify(result.operators, null, 2));

const dist = join('.output', fixture);
await mkdir(dist, { recursive: true });
await writeFile(join(dist, 'config.json'), JSON.stringify(result, null, 2));

consola.success('done!');
