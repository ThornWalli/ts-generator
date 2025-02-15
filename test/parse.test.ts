import { describe, expect, test } from 'vitest';
import parse from '../src/parse/index';
import { getFixtureConfig, getFixtureFile } from './utils';

describe('parse', () => {
  test('parse (default)', () => compare('default'));
  test('parse (doctype)', () => compare('doctype'));
  test('parse (math)', () => compare('math'));
  test('parse (test)', () => compare('test'));
});

async function compare(fixture: string) {
  const { filename, data } = await getFixtureFile(fixture);
  const source = await getFixtureConfig(fixture);
  const target = parse(filename, data);
  expect(target).toEqual(source);
}
