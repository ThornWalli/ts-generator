import ts, { isDotDotDotToken } from 'typescript';
import {
  OperatorDescription,
  ParameterDescription,
  SubOperatorDescription,
  TYPE_DEFINITIONS,
  TypeDescription,
  OperatorParameter,
  OperatorType
} from '../types';
import { getDocType } from './doctype';

export function getOperators(sourceFile: ts.SourceFile) {
  const functionDeclarations = sourceFile.statements.filter(ts.isFunctionDeclaration);
  return functionDeclarations.reduce((result: OperatorDescription[], functionDeclaration) => {
    const name = functionDeclaration.name?.text;
    if (name) {
      const parameters = getFunctionParameters(functionDeclaration);
      if (functionDeclaration.body) {
        const innerFunction = getInnerFunction(functionDeclaration.body);
        if (innerFunction) {
          const { returnType, parameterType, operators } = parseInnerFunction(innerFunction);
          result.push({
            returnType,
            parameterType,
            typeParameters: getTypeParameters(functionDeclaration.typeParameters),
            docType: getDocType(functionDeclaration),
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

function getTypeParameters(parameters: ts.NodeArray<ts.TypeParameterDeclaration> | undefined) {
  return (parameters || []).map(param => {
    return param.name.getText();
  });
}

function parseInnerFunction(arrowFunction: ts.ArrowFunction): {
  returnType: OperatorType | undefined;
  parameterType: OperatorParameter | undefined;
  operators: SubOperatorDescription[];
} {
  // const returnType = getDefaultReturnType();

  let returnType = undefined;
  if (arrowFunction.type && ts.isTypeReferenceNode(arrowFunction.type)) {
    const name = arrowFunction.type.typeName.getText();
    returnType = { name, typeParameters: getTypeDefinitions(arrowFunction.type.typeArguments) };
  }

  let parameterType = undefined;
  const [parameterSource] = arrowFunction.parameters;
  if (ts.isParameter(parameterSource) && parameterSource.type && ts.isTypeReferenceNode(parameterSource.type)) {
    const name = parameterSource.type.typeName.getText();
    parameterType = { name, typeParameters: getTypeDefinitions(parameterSource.type.typeArguments) };
  }

  const pipeArguments: ts.Expression[] = getPipeArguments(arrowFunction);
  return {
    returnType,
    parameterType,
    operators: getSubOperators(pipeArguments)
  };
}

function getInnerFunction(body: ts.Block): ts.ArrowFunction | undefined {
  const returnStatement = body.statements.find(ts.isReturnStatement);
  if (returnStatement && returnStatement.expression && ts.isArrowFunction(returnStatement.expression)) {
    return returnStatement.expression;
  }
  return undefined;
}

function getTypeDefinitions(typeArguments: ts.NodeArray<ts.TypeNode> | undefined) {
  return typeArguments?.map(typeArgument => {
    return getTypeByArgument(typeArgument);
  });
}

const getFunctionParameters = (functionDeclaration: ts.FunctionDeclaration) => {
  const parameters = functionDeclaration.parameters.map(parameter => {
    const name = parameter.name.getText();
    const type = parameter.type ? parameter.type.getText() : TYPE_DEFINITIONS.Any;
    return {
      arrowFunction: false,
      threeDots: (parameter.dotDotDotToken && isDotDotDotToken(parameter.dotDotDotToken)) || false,
      name,
      type: [type],
      parameters: [],
      body: undefined
    };
  }) as ParameterDescription[];

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
  return values.map(arg => parseFunction(arg as ts.ArrowFunction)) as ParameterDescription[];
}

function getTypeByArgument(typeArgument: ts.TypeReferenceNode | ts.TypeNode): TypeDescription {
  switch (typeArgument.kind as ts.SyntaxKind) {
    case ts.SyntaxKind.NumberKeyword:
      return { name: TYPE_DEFINITIONS.Number } as TypeDescription;
    case ts.SyntaxKind.StringKeyword:
      return { name: TYPE_DEFINITIONS.String } as TypeDescription;
    case ts.SyntaxKind.BooleanKeyword:
      return { name: TYPE_DEFINITIONS.Boolean } as TypeDescription;
    default:
      if (ts.isTypeReferenceNode(typeArgument)) {
        return {
          name: typeArgument.typeName.getText(),
          typeParameters: getTypeDefinitions(typeArgument.typeArguments)
        };
      } else {
        return { name: TYPE_DEFINITIONS.Generic } as TypeDescription;
      }
  }
}

function getPipeArguments(arrowFunction: ts.ArrowFunction): ts.Expression[] {
  if (ts.isBlock(arrowFunction.body)) {
    return arrowFunction.body.statements
      .filter(ts.isReturnStatement)
      .map(statement => statement.expression)
      .filter((expression): expression is ts.Expression => expression !== undefined && ts.isCallExpression(expression));
  } else if (ts.isCallExpression(arrowFunction.body)) {
    return [arrowFunction.body];
  }
  return [];
}

function parseFunction(functionExpression: ts.ArrowFunction | ts.FunctionExpression): ParameterDescription {
  let parameters: ParameterDescription[] = [];
  let body = undefined;
  if (ts.isIdentifier(functionExpression)) {
    parameters = [
      {
        arrowFunction: false,
        name: (functionExpression as ts.Identifier).getText(),
        threeDots: false,
        type: [],
        parameters: [],
        body: undefined
      }
    ];
  } else if (ts.isArrowFunction(functionExpression) || ts.isFunctionExpression(functionExpression)) {
    parameters = (functionExpression.parameters || [])
      .filter(parameter => ts.isParameter(parameter))
      .map(parameter => {
        const types = [];
        if (parameter.type && ts.isTupleTypeNode(parameter.type)) {
          types.push(...parameter.type.elements);
        } else if (parameter.type) {
          types.push(parameter.type);
        }

        return {
          arrowFunction: false,
          threeDots: (parameter.dotDotDotToken && isDotDotDotToken(parameter.dotDotDotToken)) || false,
          name: parameter.name.getText(),
          type: types.map(type => (type as ts.TypeNode).getText()),
          parameters: [],
          body: undefined
        };
      }) as ParameterDescription[];

    if (
      functionExpression.body &&
      (ts.isBlock(functionExpression.body) ||
        ts.isCallExpression(functionExpression.body) ||
        ts.isBinaryExpression(functionExpression.body))
    ) {
      if (
        ((ts.isCallExpression(functionExpression.body) || ts.isBinaryExpression(functionExpression.body)) &&
          functionExpression.body.getText()) ||
        (ts.isBlock(functionExpression.body) && functionExpression.body.statements?.length > 0)
      ) {
        let content = [functionExpression.body.getText()];
        if (ts.isBlock(functionExpression.body)) {
          content = functionExpression.body.statements.map(statement => {
            return statement.getText();
          });
        }
        content = cleanContent(content);

        body = {
          block: ts.isBlock(functionExpression.body),
          content
        };
      }
    }
  }
  const parameterDescription = {
    threeDots: false,
    name: undefined,
    arrowFunction: ts.isArrowFunction(functionExpression),
    type: [functionExpression.type?.getText()].filter(Boolean),
    parameters,
    body
  } as ParameterDescription;
  return parameterDescription;
}

function cleanContent(content: string[]) {
  return content.map(line => line.replace(/[ ;]*$/, '').trim());
}
