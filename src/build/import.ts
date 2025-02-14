import ts from 'typescript';
import { groupBy, uniqueBy } from '../utils.ts';
import { Configuration, ImportDeclaration } from '../types.ts';

export function getImports(config: Configuration): ts.ImportDeclaration[] {
  const importMapByPath = groupBy(uniqueBy(config.imports, 'alias'), 'path', { unique: true });
  return createImportDeclarations(importMapByPath);
}

function createImportDeclarations(importMapByPath: Record<string, ImportDeclaration[]>) {
  return Object.entries(importMapByPath)
    .map(([path, importDeclarations]) => createImportDeclaration(path, importDeclarations))
    .flat();
}

function createImportDeclaration(path: string, importDeclarations: ImportDeclaration[]) {
  return ts.factory.createImportDeclaration(
    undefined,
    ts.factory.createImportClause(false, undefined, createNamedImports(importDeclarations)),
    ts.factory.createStringLiteral(path)
  );
}

function createNamedImports(importDeclarations: ImportDeclaration[]) {
  return ts.factory.createNamedImports(
    importDeclarations.map(({ alias, name }) => {
      const propertyName = alias === name ? undefined : ts.factory.createIdentifier(name);
      return ts.factory.createImportSpecifier(false, propertyName, ts.factory.createIdentifier(alias));
    })
  );
}
