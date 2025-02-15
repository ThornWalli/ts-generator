import consola from 'consola';
import { join } from 'path';
import { config as dotEnvConfig } from 'dotenv';

import { Configuration } from '../src/types.ts';
import build from '../src/build/index.ts';
import { getFixture } from '../src/utils.ts';
import { getFixtureConfig, writeOutputFile } from '../test/utils.ts';

dotEnvConfig();

const fixture = getFixture();
const config: Configuration = await getFixtureConfig(fixture);

const result = build(config);

writeOutputFile(join('.output', fixture, 'index.ts'), result);

consola.success('done!');
