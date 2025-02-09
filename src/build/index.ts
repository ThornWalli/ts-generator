import { mkdir, readFile, writeFile } from 'fs/promises';
import * as ts from 'typescript';
import { OperatorDescription } from '../type.ts';
import { getOperators } from '../build/utils.ts';
import consola from 'consola';

const config: OperatorDescription[] = await readFile('test/fixtures/config.default.json', 'utf-8').then(JSON.parse);

const sourceFile = ts.createSourceFile('test.ts', '', ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);

const { functions, imports } = getOperators(config);

const updatedSourceFile = ts.factory.updateSourceFile(sourceFile, [...imports, ...functions]);

const printer = ts.createPrinter();
const result = printer.printFile(updatedSourceFile);

await mkdir('.output', { recursive: true });
await writeFile('.output/index.ts', result);

consola.success('done!');
