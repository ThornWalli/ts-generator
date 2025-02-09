import ts from 'typescript';
import { Configuration, ImportDeclaration, OperatorDescription } from '../types.ts';
import { groupBy, uniqueBy } from '../utils.ts';

export function getImports(config: Configuration): ts.ImportDeclaration[] {
  // prepare imports
  const importMapByPath = groupBy(uniqueBy(config.imports, 'alias'), 'path', { unique: true });

  return createImportDeclarations(importMapByPath);
}

export function getOperators(config: Configuration): ts.FunctionDeclaration[] {
  return config.operators.map(operatorConfig => createOperator(operatorConfig));
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
            importDeclarations.map(({ alias, name }) => {
              const propertyName = alias === name ? undefined : ts.factory.createIdentifier(name);
              return ts.factory.createImportSpecifier(false, propertyName, ts.factory.createIdentifier(alias));
            })
          )
        ),
        ts.factory.createStringLiteral(path)
      );
    })
    .flat();
}

export function createOperator(options: OperatorDescription): ts.FunctionDeclaration {
  const innerFunction = ts.factory.createArrowFunction(
    [],
    [],
    [
      ts.factory.createParameterDeclaration(
        [],
        undefined,
        'source',
        undefined,
        ts.factory.createTypeReferenceNode(options.returnType.name, [
          ts.factory.createTypeReferenceNode(options.returnType.type, [])
        ]),
        undefined
      )
    ],
    ts.factory.createTypeReferenceNode(options.returnType.name, [
      ts.factory.createTypeReferenceNode(options.returnType.type, [])
    ]),
    undefined,
    ts.factory.createBlock(
      [
        ts.factory.createReturnStatement(
          ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('source'), 'pipe'),
            [],
            options.operators.map(operator => {
              const parameters = operator.parameters.map(({ name }) => {
                return ts.factory.createIdentifier(name);
              });
              return ts.factory.createCallExpression(ts.factory.createIdentifier(operator.name), [], parameters);
            })
          )
        )
      ],
      false
    )
  );

  const block = ts.factory.createBlock([ts.factory.createReturnStatement(innerFunction)], false);

  const parameters = options.parameters.map(({ name, type }) => {
    return ts.factory.createParameterDeclaration(
      [],
      undefined,
      name,
      undefined,
      ts.factory.createTypeReferenceNode(type),
      undefined
    );
  });
  const functionDeclaration = ts.factory.createFunctionDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    undefined,
    options.name,
    options.returnType.generic ? [ts.factory.createTypeParameterDeclaration([], 'T', undefined, undefined)] : undefined,
    parameters,
    undefined,
    block
  );

  return functionDeclaration;
}

export function build(config: Configuration) {
  const sourceFile = ts.createSourceFile('index.ts', '', ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);

  const imports = getImports(config);
  const functions = getOperators(config);

  const updatedSourceFile = ts.factory.updateSourceFile(sourceFile, [...imports, ...functions]);

  const printer = ts.createPrinter();
  return printer.printFile(updatedSourceFile);
}
