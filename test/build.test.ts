import { describe, expect, test } from 'vitest';
import { getFixtureConfig, getFixtureFile } from './utils';
import { build } from '../src/build/utils';

describe('build', () => {
  test('build (default)', async () => {
    const { content } = await getFixtureFile('default');
    const config = await getFixtureConfig('default');
    expect(build(config)).toEqual(content);
  });
});
