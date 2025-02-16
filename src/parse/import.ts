import ts from 'typescript';
import { ImportDeclaration } from '../types';

export function getImportDeclarations(sourceFile: ts.SourceFile) {
  const importDeclarations = sourceFile.statements.filter(ts.isImportDeclaration);
  return importDeclarations.reduce((result: ImportDeclaration[], importDeclaration) => {
    const importSpecifiers = getImportSpecifiers(importDeclaration);

    if (importSpecifiers) {
      const specifiers = getSpecifiers(importSpecifiers);

      specifiers.forEach(({ name, alias }) => {
        if (name && alias) {
          result.push({
            alias,
            name,
            path: (importDeclaration.moduleSpecifier as ts.StringLiteral).text
          });
        }
      });
    }
    return result;
  }, []);
}

function getImportSpecifiers(importDeclaration: ts.ImportDeclaration) {
  return importDeclaration.importClause?.namedBindings &&
    ts.isNamedImports(importDeclaration.importClause.namedBindings)
    ? importDeclaration.importClause.namedBindings.elements
    : undefined;
}

function getSpecifiers(importSpecifiers: ts.NodeArray<ts.ImportSpecifier>) {
  return importSpecifiers.reduce(
    (result, importSpecifier) => {
      if (ts.isImportSpecifier(importSpecifier)) {
        const alias = importSpecifier.name.text;
        const name = importSpecifier.propertyName ? importSpecifier.propertyName.text : importSpecifier.name.text;
        result.push({
          alias,
          name
        });
      }
      return result;
    },
    [] as { name: string | undefined; alias: string | undefined }[]
  );
}
