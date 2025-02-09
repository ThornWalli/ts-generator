import { readFile } from 'fs/promises';
import { basename } from 'path';
import { Observable } from 'rxjs';

export function getFixtureConfig(fixture: string) {
  const filepath = `test/fixtures/${fixture}/config.json`;
  return readFile(filepath, 'utf-8').then(JSON.parse);
}

export async function getFixtureFile(fixture: string) {
  const filepath = `test/fixtures/${fixture}/index.ts`;
  const content = await readFile(filepath, 'utf-8');
  return { filename: basename(filepath), content };
}

export function emptyOperator<T>(source: Observable<T>): Observable<T> {
  return source;
}
