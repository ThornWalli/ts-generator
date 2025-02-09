import ts from 'typescript';
import { ImportDeclaration } from '../../types.ts';

export function getImportDeclarations(sourceFile: ts.SourceFile) {
  const importDeclarations = sourceFile.statements.filter(ts.isImportDeclaration);
  return importDeclarations.reduce((result: ImportDeclaration[], importDeclaration) => {
    const importSpecifiers =
      importDeclaration.importClause?.namedBindings && ts.isNamedImports(importDeclaration.importClause.namedBindings)
        ? importDeclaration.importClause.namedBindings.elements
        : [];

    const specifiers: { name: string | undefined; alias: string | undefined }[] = [];
    importSpecifiers.forEach(importSpecifier => {
      if (ts.isImportSpecifier(importSpecifier)) {
        const alias = importSpecifier.name.text;
        const name = importSpecifier.propertyName ? importSpecifier.propertyName.text : importSpecifier.name.text;
        specifiers.push({
          alias,
          name
        });
      }
    });

    specifiers.forEach(({ name, alias }) => {
      if (name && alias) {
        result.push({
          alias,
          name,
          path: (importDeclaration.moduleSpecifier as ts.StringLiteral).text
        });
      }
    });
    return result;
  }, []);
}
