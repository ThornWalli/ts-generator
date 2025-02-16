import consola from 'consola';
import { join } from 'path';
import { config as dotEnvConfig } from 'dotenv';

import { Configuration } from '../src/types';
import build from '../src/build/index';
import { getFixture } from '../src/utils';
import { getFixtureConfig, writeOutputFile } from '../test/utils';

dotEnvConfig();

const fixture = getFixture();
const config: Configuration = await getFixtureConfig(fixture);

const result = build(config);

writeOutputFile(join('.output', fixture, 'index.ts'), result);

consola.success('done!');
