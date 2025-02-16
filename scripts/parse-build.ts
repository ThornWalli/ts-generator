import consola from 'consola';
import { join } from 'path';
import { config as dotEnvConfig } from 'dotenv';

import parse from '../src/parse/index';
import { getFixture } from '../src/utils';
import { getFixtureFile, writeOutputFile } from '../test/utils';

import build from '../src/build/index';

dotEnvConfig();

const fixture = getFixture();
const { data } = await getFixtureFile(fixture);

const config = parse('index.ts', data);
writeOutputFile(join('.output', fixture, 'config.json'), JSON.stringify(config, null, 2));

const result = build(config);
writeOutputFile(join('.output', fixture, 'index.ts'), result);

consola.success('done!');
