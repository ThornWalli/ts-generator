import ts, { JSDocTag } from 'typescript';
import { DocTypeDescription } from '../types';

export function addDocType(functionDeclaration: ts.FunctionDeclaration, options: DocTypeDescription) {
  const tags: JSDocTag[] = [
    ...options.params.map(param => {
      return ts.factory.createJSDocParameterTag(
        undefined,
        ts.factory.createIdentifier(param.name),
        false,
        ts.factory.createJSDocTypeExpression(
          ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(param.type), undefined)
        ),
        false,
        param.description
      );
    })
  ];
  if (options.returns) {
    tags.push(
      ts.factory.createJSDocReturnTag(
        undefined,
        ts.factory.createJSDocTypeExpression(
          ts.factory.createTypeReferenceNode(
            ts.factory.createIdentifier(options.returns.name),
            options.returns.type.map(type =>
              ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(type), undefined)
            )
          )
        ),
        options.returns.description
      )
    );
  }
  const jsDocComment = ts.factory.createJSDocComment(options.description, tags);
  const printer = ts.createPrinter();
  const jsDocCommentString = printer.printNode(
    ts.EmitHint.Unspecified,
    jsDocComment,
    functionDeclaration.getSourceFile()
  );

  ts.addSyntheticLeadingComment(
    functionDeclaration,
    ts.SyntaxKind.MultiLineCommentTrivia,
    cleanComment(jsDocCommentString),
    true
  );
}

/**
 * Remove the leading and trailing \/** and *\/
 * @param {string} comment
 */
function cleanComment(comment: string) {
  return comment.replace(/^\/\*/, '').replace(/\*\/$/, '');
}
