import ts from 'typescript';
import { Configuration, OperatorDescription } from '../types.ts';
import { addDocType } from './doctype.ts';

export function getOperators(config: Configuration): ts.FunctionDeclaration[] {
  return config.operators.map(operatorConfig => createOperator(operatorConfig));
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

  if (options.docType) {
    addDocType(functionDeclaration, options.docType);
  }

  return functionDeclaration;
}
