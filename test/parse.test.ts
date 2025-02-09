import { describe, expect, test } from 'vitest';
import { parse } from '../src/parse/utils';
import { getFixtureConfig, getFixtureFile } from './utils';

describe('parse', () => {
  test('parse (default)', async () => {
    const { filename, content } = await getFixtureFile('default');
    const config = await getFixtureConfig('default');
    expect(parse(filename, content)).toEqual(config);
  });
});
