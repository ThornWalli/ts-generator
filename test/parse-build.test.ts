import { describe, expect, test } from 'vitest';
import { build, parse } from '../src';
import { getFixtureFile } from './utils';

describe('parse', () => {
  test('parse & build (default)', () => parseBuild('default'));
  test('parse (doctype)', () => parseBuild('doctype'));
  test('parse (math)', () => parseBuild('math'));
  test('parse (test)', () => parseBuild('test'));
});

async function parseBuild(fixture: string) {
  const { filename, data: source } = await getFixtureFile(fixture);
  const target = build(parse(filename, source));
  expect(target).toEqual(source);
}
