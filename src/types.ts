import ts from 'typescript';

export type ReturnType = {
  type: string;
  name: string;
  generic: boolean;
};

export type OperatorDescription = {
  returnType: ReturnType;
  name: string;
  operators: SubOperatorDescription[];
  parameters: ParameterDescription[];
};
export type SubOperatorDescription = {
  name: string;
  importDeclaration: ImportDeclaration | undefined;
  parameters: ParameterDescription[];
};
export type ParameterDescription = { name: string; type: string };

export type ImportDeclaration = {
  local: string;
  imported: string;
  path: string;
};

export type ParsedOperatorDescription = {
  function: ts.FunctionDeclaration;
  imports: ImportDeclaration[];
};
