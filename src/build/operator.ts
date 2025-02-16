import ts from 'typescript';
import {
  Configuration,
  OperatorDescription,
  ParameterDescription,
  SubOperatorDescription,
  TypeDescription
} from '../types';
import { addDocType } from './doctype';

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
        (options.parameterType &&
          ts.factory.createTypeReferenceNode(
            options.parameterType.name,
            createTypeReferenceNodes(options.parameterType.typeParameters)
          )) ||
          undefined,
        undefined
      )
    ],
    (options.returnType &&
      ts.factory.createTypeReferenceNode(
        options.returnType.name,
        createTypeReferenceNodes(options.returnType.typeParameters)
      )) ||
      undefined,
    undefined,
    ts.factory.createBlock([ts.factory.createReturnStatement(createPipeCall(options.operators))], false)
  );

  const functionDeclaration = ts.factory.createFunctionDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    undefined,
    options.name,
    createTypeParameters(options.typeParameters),
    createParameterDeclarations(options.parameters),
    undefined,
    ts.factory.createBlock([ts.factory.createReturnStatement(innerFunction)], false)
  );

  if (options.docType) {
    addDocType(functionDeclaration, options.docType);
  }

  return functionDeclaration;
}

function createParameterDeclarations(parameters: ParameterDescription[]): ts.ParameterDeclaration[] {
  return parameters.map(({ name, type }) =>
    ts.factory.createParameterDeclaration(
      [],
      undefined,
      name as string,
      undefined,
      ts.factory.createTypeReferenceNode(type[0] as string, []),
      undefined
    )
  );
}

function createTypeParameters(typeParameters: string[]): ts.TypeParameterDeclaration[] | undefined {
  return typeParameters.map(typeParameter =>
    ts.factory.createTypeParameterDeclaration([], typeParameter, undefined, undefined)
  );
}

function createPipeCall(operators: SubOperatorDescription[]): ts.CallExpression {
  return ts.factory.createCallExpression(
    ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier(IDENTIFIER_SOURCE), FUNCTION_PIPE),
    [],
    operators.map(operator => {
      const parameters = operator.parameters
        .map(({ arrowFunction, type, parameters, body }) => {
          const parameterDeclarations = parameters.map(({ threeDots, name, type }) => {
            let preparedType;
            if (type.length > 1) {
              preparedType = ts.factory.createTupleTypeNode(
                type.map(type => ts.factory.createTypeReferenceNode(type, []))
              );
            } else if (type.length > 0) {
              preparedType = ts.factory.createTypeReferenceNode(type[0], []);
            }
            return ts.factory.createParameterDeclaration(
              [],
              threeDots ? ts.factory.createToken(ts.SyntaxKind.DotDotDotToken) : undefined,
              name as string,
              undefined,
              preparedType,
              undefined
            );
          });
          if (!body) {
            return parameters.map(parameter => ts.factory.createIdentifier(parameter.name || ''));
          } else if (arrowFunction) {
            return ts.factory.createArrowFunction(
              [],
              [],
              parameterDeclarations,
              prepareTypes(type),
              undefined,
              body && (resolveBody(body) as ts.Block)
            );
          } else {
            return ts.factory.createFunctionExpression(
              undefined,
              undefined,
              undefined,
              undefined,
              parameterDeclarations,
              prepareTypes(type),
              body && (resolveBody(body) as ts.Block)
            );
          }
        })
        .flat();
      return ts.factory.createCallExpression(ts.factory.createIdentifier(operator.name), [], parameters);
    })
  );
}

function prepareTypes(type: string[]): ts.TypeNode | undefined {
  if (type.length > 1) {
    return ts.factory.createTupleTypeNode(type.map(type => ts.factory.createTypeReferenceNode(type, [])));
  } else if (type.length > 0) {
    return ts.factory.createTypeReferenceNode(type[0], []);
  }
  return undefined;
}

const resolveBody = ({ block, content }: { block: boolean; content: string[] }): ts.Block | ts.Identifier => {
  if (block) {
    const blocks = [];
    if (content) {
      blocks.push(ts.factory.createExpressionStatement(ts.factory.createIdentifier(content.join('; '))));
    }
    return ts.factory.createBlock(blocks);
  }
  return ts.factory.createIdentifier(content.join('; ') || '');
};

function createTypeReferenceNodes(type: TypeDescription[] | undefined): ts.TypeReferenceNode[] | undefined {
  return type?.map(type =>
    ts.factory.createTypeReferenceNode(type.name, createTypeReferenceNodes(type.typeParameters || []))
  );
}
