import { mkdir, readFile, writeFile } from 'fs/promises';
import * as ts from 'typescript';
import { getOperators, getImportDeclarations } from './utils.ts';
import consola from 'consola';

const fileContent = await readFile('test/fixtures/default/index.ts', 'utf-8');

const sourceFile = ts.createSourceFile('index.ts', fileContent, ts.ScriptTarget.ESNext, true);

const importDeclarations = getImportDeclarations(sourceFile);
// console.log('importDeclarations:', JSON.stringify(importDeclarations, null, 2));
const result = getOperators(sourceFile, importDeclarations);
// console.log('result:', JSON.stringify(result, null, 2));

await mkdir('.output', { recursive: true });
await writeFile('.output/config.json', JSON.stringify(result, null, 2));

consola.success('done!');
