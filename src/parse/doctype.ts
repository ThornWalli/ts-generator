import ts from 'typescript';
import { DocTypeDescription, TYPE_DEFINITIONS } from '../types';

export function getDocType(node: ts.Node) {
  const jsDoc = [...ts.getJSDocCommentsAndTags(node), ...ts.getJSDocTags(node)];
  if (jsDoc.length < 1) {
    return;
  }
  return jsDoc.reduce(
    (result: DocTypeDescription, entry) => {
      if (ts.isJSDocReturnTag(entry)) {
        if (entry.typeExpression && ts.isTypeReferenceNode(entry.typeExpression.type)) {
          const typeReferenceType = entry.typeExpression.type;
          if (ts.isIdentifier(typeReferenceType.typeName)) {
            const identifier = typeReferenceType.typeName;
            const type = (typeReferenceType.typeArguments || []).map(arg => arg.getText());

            result.returns = {
              name: identifier.text,
              description: ts.getTextOfJSDocComment(entry.comment),
              type
            };
          }
        }
      } else if (ts.isJSDocParameterTag(entry)) {
        result.params.push({
          name: entry.name.getText(),
          type: entry.typeExpression?.type.getText() || TYPE_DEFINITIONS.Any,
          description: ts.getTextOfJSDocComment(entry.comment)
        });
      } else if (ts.isJSDocCommentContainingNode(entry)) {
        if (result.description) {
          console.warn('Description already set', entry);
        } else {
          result.description = ts.getTextOfJSDocComment(entry.comment);
        }
      }

      return result;
    },
    {
      description: undefined,
      params: [],
      returns: undefined
    }
  );
}
