import ts from 'typescript';
import { Configuration } from '../../types.ts';
import { getImports } from './import.ts';
import { getOperators } from './operator.ts';

export function build(config: Configuration) {
  const sourceFile = ts.createSourceFile('index.ts', '', ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);

  const imports = getImports(config);
  const functions = getOperators(config);

  const updatedSourceFile = ts.factory.updateSourceFile(sourceFile, [...imports, ...functions]);

  const printer = ts.createPrinter();
  return printer.printFile(updatedSourceFile);
}
