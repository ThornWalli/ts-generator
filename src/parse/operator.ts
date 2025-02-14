import ts from 'typescript';
import {
  OperatorDescription,
  ParameterDescription,
  ReturnType,
  SubOperatorDescription,
  TYPE_DEFINITIONS
} from '../types.ts';
import { getDocType } from './doctype.ts';

export function getOperators(sourceFile: ts.SourceFile) {
  const functionDeclarations = sourceFile.statements.filter(ts.isFunctionDeclaration);
  return functionDeclarations.reduce((result: OperatorDescription[], functionDeclaration) => {
    const name = functionDeclaration.name?.text;
    if (name) {
      const parameters = getFunctionParameters(functionDeclaration);
      if (functionDeclaration.body) {
        const innerFunction = getInnerFunction(functionDeclaration.body);
        if (innerFunction) {
          const { returnType, operators } = parseInnerFunction(innerFunction);

          const docType = getDocType(functionDeclaration);

          result.push({
            docType,
            returnType,
            name,
            operators,
            parameters
          });
          return result;
        }
      }
      console.log(`Function ${name} has no body`);
    } else {
      console.log('Function has no name');
    }
    return result;
  }, []);
}

function parseInnerFunction(arrowFunction: ts.ArrowFunction): {
  returnType: ReturnType;
  operators: SubOperatorDescription[];
} {
  let returnType = getDefaultReturnType();
  const [sourceParameter] = arrowFunction.parameters;
  if (ts.isParameter(sourceParameter) && sourceParameter.type && ts.isTypeReferenceNode(sourceParameter.type)) {
    const name = sourceParameter.type.typeName.getText();
    const type = getTypeDefinitions(sourceParameter.type.typeArguments);
    returnType = { name, type, generic: type[0] === 'T' };
  }
  const pipeArguments: ts.Expression[] = getPipeArguments(arrowFunction);
  return { returnType, operators: getSubOperators(pipeArguments) };
}

function getInnerFunction(body: ts.Block): ts.ArrowFunction | undefined {
  const returnStatement = body.statements.find(ts.isReturnStatement);
  if (returnStatement && returnStatement.expression && ts.isArrowFunction(returnStatement.expression)) {
    return returnStatement.expression;
  }
  return undefined;
}

function getTypeDefinitions(typeArguments: ts.NodeArray<ts.TypeNode> | undefined) {
  return (
    (typeArguments || []).map(typeArgument => {
      return getTypeByKind(typeArgument?.kind || ts.SyntaxKind.AnyKeyword);
    }) || []
  );
}

function getDefaultReturnType(): ReturnType {
  return {
    type: [TYPE_DEFINITIONS.Generic],
    name: TYPE_DEFINITIONS.Generic,
    generic: true
  };
}

const getFunctionParameters = (functionDeclaration: ts.FunctionDeclaration) => {
  const parameters = functionDeclaration.parameters.map(parameter => {
    const name = parameter.name.getText();
    const type = parameter.type ? parameter.type.getText() : TYPE_DEFINITIONS.Any;
    return { name, type };
  });

  return parameters;
};

function getSubOperators(pipeArguments: ts.Expression[]) {
  return pipeArguments.reduce((result, expression) => {
    if (ts.isCallExpression(expression)) {
      expression.arguments.forEach(argument => {
        if (ts.isCallExpression(argument) && ts.isIdentifier(argument.expression)) {
          const identifier = argument.expression;
          result.push({
            name: identifier.getText(),
            parameters: getParameterDescriptions(argument.arguments)
          });
        }
      });
    }
    return result;
  }, [] as SubOperatorDescription[]);
}

function getParameterDescriptions(values: ts.NodeArray<ts.Expression>) {
  return values.map(arg => ({ name: arg.getText() })) as ParameterDescription[];
}

const getTypeByKind = (kind: ts.SyntaxKind) => {
  switch (kind) {
    case ts.SyntaxKind.NumberKeyword:
      return TYPE_DEFINITIONS.Number;
    case ts.SyntaxKind.StringKeyword:
      return TYPE_DEFINITIONS.String;
    case ts.SyntaxKind.BooleanKeyword:
      return TYPE_DEFINITIONS.Boolean;
    default:
      return TYPE_DEFINITIONS.Generic;
  }
};

function getPipeArguments(arrowFunction: ts.ArrowFunction): ts.Expression[] {
  return ts.isBlock(arrowFunction.body)
    ? arrowFunction.body.statements
        .filter(ts.isReturnStatement)
        .map(statement => statement.expression)
        .filter(
          (expression): expression is ts.Expression => expression !== undefined && ts.isCallExpression(expression)
        )
    : [];
}
