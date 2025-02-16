import { basename } from 'path';
import { Observable } from 'rxjs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname } from 'path';

export function getFixtureConfig(fixture: string) {
  const filepath = `test/fixtures/${fixture}/config.json`;
  return readFile(filepath, 'utf-8').then(JSON.parse);
}

export async function getFixtureFile(fixture: string) {
  const filepath = `test/fixtures/${fixture}/index.ts`;
  const data = await readFile(filepath, 'utf-8');
  return { filename: basename(filepath), data };
}

export function emptyOperator<T>(source: Observable<T>): Observable<T> {
  return source;
}

export async function writeOutputFile(path: string, data: string) {
  await mkdir(dirname(path), { recursive: true });
  return writeFile(path, data);
}
