import { describe, expect, test } from 'vitest';
import parse from '../src/parse/index';
import { getFixtureConfig, getFixtureFile } from './utils';

describe('parse', () => {
  test('parse (default)', () => compare('default'));
  test('parse (math)', () => compare('math'));
  test('parse (doctype)', () => compare('doctype'));
});

async function compare(fixture: string) {
  const { filename, content } = await getFixtureFile(fixture);
  const config = await getFixtureConfig(fixture);
  expect(parse(filename, content)).toEqual(config);
}
