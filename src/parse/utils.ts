import ts from 'typescript';
import { ImportDeclaration, OperatorDescription, SubOperatorDescription } from '../type';

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

    // let importName, localName;
    // const [imported, local] = importSpecifiers;
    // const specifiers: { imported: string | undefined; local: string | undefined }[] = [];
    // if (imported && ts.isImportSpecifier(imported)) {
    //   importName = imported.name.text;
    //   importName = imported.propertyName ? imported.propertyName.text : imported.name.text;
    // }
    // if (local && ts.isImportSpecifier(local)) {
    //   localName = local.name.text;
    //   localName = local.propertyName ? local.propertyName.text : local.name.text;
    // }
    // specifiers.push({
    //   imported: importName,
    //   local: localName
    // });
    // else if() {
    //   const importName = imported.name.text;
    //   const localName = local.name.text;
    //   specifiers.push({
    //     imported: importName,
    //     local: localName
    //   });
    // }

    // const specifiers: { imported: string; local: string }[] = importSpecifiers.map(importSpecifier => {
    //   debugger;
    //   if (ts.isImportEqualsDeclaration(importSpecifier)) {
    //   } else {
    //     const imported = importSpecifier.name.text;
    //     const local = importSpecifier.propertyName ? importSpecifier.propertyName.text : importSpecifier.name.text;
    //     return {
    //       imported,
    //       local
    //     };
    //   }
    // });
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
