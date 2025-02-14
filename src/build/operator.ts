import ts from 'typescript';
import {
  Configuration,
  OperatorDescription,
  ReturnType,
  SubOperatorDescription,
  TYPE_DEFINITION,
  TYPE_DEFINITIONS
} from '../types.ts';
import { addDocType } from './doctype.ts';

const IDENTIFIER_SOURCE = 'source';
const FUNCTION_PIPE = 'pipe';

export function getOperators(config: Configuration): ts.FunctionDeclaration[] {
  return config.operators.map(operatorConfig => createOperator(operatorConfig));
}

function createOperator(options: OperatorDescription): ts.FunctionDeclaration {
  const innerFunction = ts.factory.createArrowFunction(
    [],
    [],
    [
      ts.factory.createParameterDeclaration(
        [],
        undefined,
        IDENTIFIER_SOURCE,
        undefined,
        ts.factory.createTypeReferenceNode(options.returnType.name, createTypeReferenceNodes(options.returnType.type)),
        undefined
      )
    ],
    ts.factory.createTypeReferenceNode(options.returnType.name, createTypeReferenceNodes(options.returnType.type)),
    undefined,
    ts.factory.createBlock([ts.factory.createReturnStatement(createPipeCall(options.operators))], false)
  );

  const functionDeclaration = ts.factory.createFunctionDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    undefined,
    options.name,
    createTypeParameters(options.returnType),
    createParameterDeclarations(options.parameters),
    undefined,
    ts.factory.createBlock([ts.factory.createReturnStatement(innerFunction)], false)
  );

  if (options.docType) {
    addDocType(functionDeclaration, options.docType);
  }

  return functionDeclaration;
}

function createParameterDeclarations(parameters: { name: string; type: string }[]): ts.ParameterDeclaration[] {
  return parameters.map(({ name, type }) =>
    ts.factory.createParameterDeclaration(
      [],
      undefined,
      name,
      undefined,
      ts.factory.createTypeReferenceNode(type, []),
      undefined
    )
  );
}

function createTypeParameters(returnType: ReturnType): ts.TypeParameterDeclaration[] | undefined {
  return returnType.generic
    ? [ts.factory.createTypeParameterDeclaration([], TYPE_DEFINITIONS.Generic, undefined, undefined)]
    : undefined;
}

function createPipeCall(operators: SubOperatorDescription[]): ts.CallExpression {
  return ts.factory.createCallExpression(
    ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier(IDENTIFIER_SOURCE), FUNCTION_PIPE),
    [],
    operators.map(operator => {
      const parameters = operator.parameters.map(({ name }) => {
        return ts.factory.createIdentifier(name);
      });
      return ts.factory.createCallExpression(ts.factory.createIdentifier(operator.name), [], parameters);
    })
  );
}

function createTypeReferenceNodes(type: TYPE_DEFINITION[]): ts.TypeReferenceNode[] {
  return type.map(type => ts.factory.createTypeReferenceNode(type, []));
}
