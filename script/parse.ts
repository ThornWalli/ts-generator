import consola from 'consola';
import { join } from 'path';
import { config as dotEnvConfig } from 'dotenv';

import parse from '../src/parse/index.ts';
import { getFixture } from '../src/utils.ts';
import { getFixtureFile, writeOutputFile } from '../test/utils.ts';

dotEnvConfig();

const fixture = getFixture();
const { data } = await getFixtureFile(fixture);

const result = parse('index.ts', data);
// debugger;
// console.debug('imports:', JSON.stringify(result.imports, null, 2));
// console.debug('operators:', JSON.stringify(result.operators, null, 2));

writeOutputFile(join('.output', fixture, 'config.json'), JSON.stringify(result, null, 2));

consola.success('done!');
