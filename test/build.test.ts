import { describe, expect, test } from 'vitest';
import { getFixtureConfig, getFixtureFile } from './utils';
import { build } from '../src';

describe('build', () => {
  test('build (default)', () => compare('default'));
  test('build (doctype)', () => compare('doctype'));
  test('build (math)', () => compare('math'));
  test('build (test)', () => compare('test'));
});

async function compare(fixture: string) {
  const { data: source } = await getFixtureFile(fixture);
  const config = await getFixtureConfig(fixture);
  const target = build(config);
  expect(target).toEqual(source);
}
