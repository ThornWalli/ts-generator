import ts from 'typescript';
import { ImportDeclaration, OperatorDescription, SubOperatorDescription } from '../type';

export function getImportDeclarations(sourceFile: ts.SourceFile) {
  const importDeclarations = sourceFile.statements.filter(ts.isImportDeclaration);
  return importDeclarations.reduce((result: ImportDeclaration[], importDeclaration) => {
    const importSpecifiers =
      importDeclaration.importClause?.namedBindings && ts.isNamedImports(importDeclaration.importClause.namedBindings)
        ? importDeclaration.importClause.namedBindings.elements
        : [];
    const specifiers: { imported: string; local: string }[] = importSpecifiers.map(importSpecifier => {
      const imported = importSpecifier.name.text;
      const local = importSpecifier.propertyName ? importSpecifier.propertyName.text : importSpecifier.name.text;
      return {
        imported,
        local
      };
    });
    specifiers.forEach(({ imported, local }) => {
      result.push({
        local,
        imported,
        path: (importDeclaration.moduleSpecifier as ts.StringLiteral).text
      });
    });
    return result;
  }, []);
}

export function getOperators(sourceFile: ts.SourceFile, importDeclaration: ImportDeclaration[]) {
  const functionDeclarations = sourceFile.statements.filter(ts.isFunctionDeclaration);
  return functionDeclarations.reduce((result: OperatorDescription[], functionDeclaration) => {
    if (functionDeclaration.name) {
      const operatorName = functionDeclaration.name.text;
      const operators: SubOperatorDescription[] = [];

      if (functionDeclaration.body) {
        const returnStatement = functionDeclaration.body.statements.find(ts.isReturnStatement);
        if (returnStatement && returnStatement.expression && ts.isArrowFunction(returnStatement.expression)) {
          const arrowFunction = returnStatement.expression;
          const pipeArguments: ts.Expression[] = ts.isBlock(arrowFunction.body)
            ? arrowFunction.body.statements
                .filter(ts.isReturnStatement)
                .map(statement => statement.expression)
                .filter(
                  (expression): expression is ts.Expression =>
                    expression !== undefined && ts.isCallExpression(expression)
                )
            : [];
          pipeArguments.forEach(expression => {
            if (ts.isCallExpression(expression)) {
              expression.arguments.forEach(argument => {
                if (ts.isCallExpression(argument) && ts.isIdentifier(argument.expression)) {
                  const identifier = argument.expression;
                  operators.push({
                    name: identifier.text,
                    importDeclaration: importDeclaration.find(
                      importDeclaration => importDeclaration.local === identifier.text
                    )
                  });
                }
              });
            }
          });
        }
      }

      result.push({
        name: operatorName,
        operators,
        parameters: []
      });
    }
    return result;
  }, []);
}
