import ts from 'typescript';
import {
  OperatorDescription,
  ParameterDescription,
  ReturnType,
  SubOperatorDescription,
  TYPE_DEFINITION
} from '../../types.ts';
import { getDocType } from './doctype.ts';

export function getOperators(sourceFile: ts.SourceFile) {
  const functionDeclarations = sourceFile.statements.filter(ts.isFunctionDeclaration);
  return functionDeclarations.reduce((result: OperatorDescription[], functionDeclaration) => {
    if (functionDeclaration.name) {
      const operatorName = functionDeclaration.name.text;
      const operators: SubOperatorDescription[] = [];

      let returnType = getDefaultReturnType();
      const parameters = getFunctionParameters(functionDeclaration);
      if (functionDeclaration.body) {
        const returnStatement = functionDeclaration.body.statements.find(ts.isReturnStatement);
        if (returnStatement && returnStatement.expression && ts.isArrowFunction(returnStatement.expression)) {
          const arrowFunction = returnStatement.expression;
          const [sourceParameter] = arrowFunction.parameters;
          if (ts.isParameter(sourceParameter)) {
            if (sourceParameter.type && ts.isTypeReferenceNode(sourceParameter.type)) {
              const name = sourceParameter.type.typeName.getText();
              const [typeArgument] = sourceParameter.type.typeArguments || [];
              const type = getTypeByKind(typeArgument?.kind || ts.SyntaxKind.AnyKeyword);
              returnType = { name, type, generic: type === 'T' };
            }
          }
          const pipeArguments: ts.Expression[] = getPipeArguments(arrowFunction);
          operators.push(...getSubOperators(pipeArguments));
        }
      }

      const docType = getDocType(functionDeclaration);

      result.push({
        docType,
        returnType,
        name: operatorName,
        operators,
        parameters
      });
    }
    return result;
  }, []);
}

function getDefaultReturnType(): ReturnType {
  return {
    type: TYPE_DEFINITION.Generic,
    name: 'T',
    generic: true
  };
}

const getFunctionParameters = (functionDeclaration: ts.FunctionDeclaration) => {
  const parameters = functionDeclaration.parameters.map(parameter => {
    const name = parameter.name.getText();
    const type = parameter.type ? parameter.type.getText() : 'any';
    return { name, type };
  });

  return parameters;
};

const getSubOperators = (pipeArguments: ts.Expression[]) => {
  return pipeArguments.reduce((result, expression) => {
    if (ts.isCallExpression(expression)) {
      expression.arguments.forEach(argument => {
        if (ts.isCallExpression(argument) && ts.isIdentifier(argument.expression)) {
          const identifier = argument.expression;
          const parameters = argument.arguments.map(arg => {
            return { name: arg.getText() };
          }) as ParameterDescription[];

          result.push({
            parameters,
            name: identifier.getText()
          });
        }
      });
    }
    return result;
  }, [] as SubOperatorDescription[]);
};

const getTypeByKind = (kind: ts.SyntaxKind) => {
  switch (kind) {
    case ts.SyntaxKind.NumberKeyword:
      return TYPE_DEFINITION.Number;
    case ts.SyntaxKind.StringKeyword:
      return TYPE_DEFINITION.String;
    case ts.SyntaxKind.BooleanKeyword:
      return TYPE_DEFINITION.Boolean;
    default:
      return TYPE_DEFINITION.Generic;
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
