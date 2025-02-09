import ts from 'typescript';
import { ImportDeclaration, OperatorDescription, ParsedOperatorDescription } from '../type';
import { groupBy, uniqueBy } from '../utils.ts';

export function getOperators(config: OperatorDescription[]): {
  functions: ts.FunctionDeclaration[];
  imports: ts.ImportDeclaration[];
} {
  // extract functions and imports
  const { functions, imports } = config
    .map(operatorConfig => createOperator(operatorConfig))
    .reduce(
      (result: { functions: ts.FunctionDeclaration[]; imports: ImportDeclaration[] }, operator) => {
        result.functions.push(operator.function);
        result.imports.push(...operator.imports);
        return result;
      },
      {
        functions: [],
        imports: []
      }
    );

  // prepare imports
  const importMapByPath = groupBy(uniqueBy(imports, 'local'), 'path', { unique: true });

  importMapByPath['rxjs'] = importMapByPath['rxjs'] || [];
  // IMPORTANT: default opertator type import
  importMapByPath['rxjs'].push({
    local: 'Observable',
    imported: 'Observable',
    path: 'rxjs'
  });

  return {
    functions,
    imports: createImportDeclarations(importMapByPath)
  };
}

export function createImportDeclarations(importMapByPath: Record<string, ImportDeclaration[]>) {
  return Object.entries(importMapByPath)
    .map(([path, importDeclarations]) => {
      return ts.factory.createImportDeclaration(
        undefined,
        ts.factory.createImportClause(
          false,
          undefined,
          ts.factory.createNamedImports(
            importDeclarations.map(({ local, imported }) => {
              const propertyName = local === imported ? undefined : ts.factory.createIdentifier(imported);
              return ts.factory.createImportSpecifier(false, propertyName, ts.factory.createIdentifier(imported));
            })
          )
        ),
        ts.factory.createStringLiteral(path)
      );
    })
    .flat();
}

export function createOperator(options: OperatorDescription): ParsedOperatorDescription {
  const innerFunction = ts.factory.createArrowFunction(
    [],
    [],
    [
      ts.factory.createParameterDeclaration(
        [],
        undefined,
        'source',
        undefined,
        ts.factory.createTypeReferenceNode('Observable', [ts.factory.createTypeReferenceNode('T', [])]),
        undefined
      )
    ],
    ts.factory.createTypeReferenceNode('Observable', [ts.factory.createTypeReferenceNode('T', [])]),
    undefined,
    ts.factory.createBlock(
      [
        ts.factory.createReturnStatement(
          ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('source'), 'pipe'),
            [],
            options.operators.map(operator => {
              return ts.factory.createCallExpression(ts.factory.createIdentifier(operator.name), [], []);
            })
          )
        )
      ],
      false
    )
  );

  const block = ts.factory.createBlock([ts.factory.createReturnStatement(innerFunction)], false);

  const functionDeclaration = ts.factory.createFunctionDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    undefined,
    options.name,
    [ts.factory.createTypeParameterDeclaration([], 'T', undefined, undefined)],
    [],
    undefined,
    block
  );

  const imports: ImportDeclaration[] = options.operators
    .map(({ importDeclaration }) => importDeclaration)
    .filter((importDeclaration): importDeclaration is ImportDeclaration => importDeclaration !== undefined);

  return {
    function: functionDeclaration,
    imports
  };
}
