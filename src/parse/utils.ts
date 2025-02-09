import ts from 'typescript';
import { ImportDeclaration, OperatorDescription, ParameterDescription, SubOperatorDescription } from '../types';

export function getImportDeclarations(sourceFile: ts.SourceFile) {
  const importDeclarations = sourceFile.statements.filter(ts.isImportDeclaration);
  return importDeclarations.reduce((result: ImportDeclaration[], importDeclaration) => {
    const importSpecifiers =
      importDeclaration.importClause?.namedBindings && ts.isNamedImports(importDeclaration.importClause.namedBindings)
        ? importDeclaration.importClause.namedBindings.elements
        : [];

    const specifiers: { imported: string | undefined; local: string | undefined }[] = [];
    importSpecifiers.forEach(importSpecifier => {
      if (ts.isImportSpecifier(importSpecifier)) {
        const local = importSpecifier.name.text;
        const imported = importSpecifier.propertyName ? importSpecifier.propertyName.text : importSpecifier.name.text;
        specifiers.push({
          local,
          imported
        });
      }
    });

    specifiers.forEach(({ imported, local }) => {
      if (imported && local) {
        result.push({
          local,
          imported,
          path: (importDeclaration.moduleSpecifier as ts.StringLiteral).text
        });
      }
    });
    return result;
  }, []);
}

const getFunctionParameters = (functionDeclaration: ts.FunctionDeclaration) => {
  const parameters = functionDeclaration.parameters.map(parameter => {
    const name = parameter.name.getText();
    const type = parameter.type ? parameter.type.getText() : 'any';
    return { name, type };
  });

  return parameters;
};

const getSubOperators = (pipeArguments: ts.Expression[], importDeclaration: ImportDeclaration[]) => {
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
            name: identifier.text,
            importDeclaration: importDeclaration.find(importDeclaration => {
              return (
                (importDeclaration.local && importDeclaration.local === identifier.text) ||
                (!importDeclaration.local && importDeclaration.imported === identifier.text)
              );
            })
          });
        }
      });
    }
    return result;
  }, [] as SubOperatorDescription[]);
};

export function getPipeArguments(arrowFunction: ts.ArrowFunction): ts.Expression[] {
  return ts.isBlock(arrowFunction.body)
    ? arrowFunction.body.statements
        .filter(ts.isReturnStatement)
        .map(statement => statement.expression)
        .filter(
          (expression): expression is ts.Expression => expression !== undefined && ts.isCallExpression(expression)
        )
    : [];
}

const getTypeByKind = (kind: ts.SyntaxKind) => {
  switch (kind) {
    case ts.SyntaxKind.NumberKeyword:
      return 'number';
    case ts.SyntaxKind.StringKeyword:
      return 'string';
    case ts.SyntaxKind.BooleanKeyword:
      return 'boolean';
    default:
      return 'T';
  }
};

export function getOperators(sourceFile: ts.SourceFile, importDeclaration: ImportDeclaration[]) {
  const functionDeclarations = sourceFile.statements.filter(ts.isFunctionDeclaration);
  return functionDeclarations.reduce((result: OperatorDescription[], functionDeclaration) => {
    if (functionDeclaration.name) {
      const operatorName = functionDeclaration.name.text;
      const operators: SubOperatorDescription[] = [];

      let returnType = { name: 'Observable', type: 'T', generic: true };
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
          operators.push(...getSubOperators(pipeArguments, importDeclaration));
        }
      }

      result.push({
        returnType,
        name: operatorName,
        operators,
        parameters
      });
    }
    return result;
  }, []);
}
