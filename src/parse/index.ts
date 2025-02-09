import ts from 'typescript';
import { getImportDeclarations } from './import.ts';
import { getOperators } from './operator.ts';

export default function parse(filename: string, content: string) {
  const sourceFile = ts.createSourceFile(filename, content, ts.ScriptTarget.ESNext, true);

  const imports = getImportDeclarations(sourceFile);
  const operators = getOperators(sourceFile);

  return {
    imports,
    operators
  };
}
