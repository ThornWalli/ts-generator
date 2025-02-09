import { describe, expect, test } from 'vitest';
import { getFixtureConfig, getFixtureFile } from './utils';
import build from '../src/build/index';

describe('build', () => {
  test('build (default)', () => compare('default'));
  test('build (math)', () => compare('math'));
  test('build (doctype)', () => compare('doctype'));
});

async function compare(fixture: string) {
  const { content } = await getFixtureFile(fixture);
  const config = await getFixtureConfig(fixture);
  expect(build(config)).toEqual(content);
}
