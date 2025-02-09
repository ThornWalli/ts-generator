import { mkdir, readFile, writeFile } from 'fs/promises';
import * as ts from 'typescript';
import { getOperators, getImportDeclarations } from './utils.ts';
import consola from 'consola';
import { join } from 'path';

const fixture = process.env.npm_config_fixture || 'default';
const fileContent = await readFile(`test/fixtures/${fixture}/index.ts`, 'utf-8');

const sourceFile = ts.createSourceFile('index.ts', fileContent, ts.ScriptTarget.ESNext, true);

const imports = getImportDeclarations(sourceFile);
console.debug('imports:', JSON.stringify(imports, null, 2));

const operators = getOperators(sourceFile);
console.debug('operators:', JSON.stringify(operators, null, 2));

const result = {
  imports,
  operators
};

const dist = join('.output', fixture);
await mkdir(dist, { recursive: true });
await writeFile(join(dist, 'config.json'), JSON.stringify(result, null, 2));

consola.success('done!');
