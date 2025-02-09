import { mkdir, readFile, writeFile } from 'fs/promises';
import * as ts from 'typescript';
import { getOperators, getImportDeclarations } from './utils.ts';

const fileContent = await readFile('test/fixtures/index.ts', 'utf-8');

const sourceFile = ts.createSourceFile('index.ts', fileContent, ts.ScriptTarget.ESNext, true);

const importDeclarations = getImportDeclarations(sourceFile);
const result = getOperators(sourceFile, importDeclarations);

await mkdir('.output', { recursive: true });
await writeFile('.output/config.json', JSON.stringify(result, null, 2));
