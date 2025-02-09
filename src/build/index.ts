import { mkdir, readFile, writeFile } from 'fs/promises';
import * as ts from 'typescript';
import { OperatorDescription } from '../types.ts';
import { getOperators } from '../build/utils.ts';
import consola from 'consola';
import { join } from 'path';

const fixture = process.env.npm_config_fixture || 'default';
const config: OperatorDescription[] = await readFile(`test/fixtures/${fixture}/config.json`, 'utf-8').then(JSON.parse);

const sourceFile = ts.createSourceFile('test.ts', '', ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);

const { functions, imports } = getOperators(config);

const updatedSourceFile = ts.factory.updateSourceFile(sourceFile, [...imports, ...functions]);

const printer = ts.createPrinter();
const result = printer.printFile(updatedSourceFile);

const dist = join('.output', fixture);
await mkdir(dist, { recursive: true });
await writeFile(join(dist, 'index.ts'), result);

consola.success('done!');
