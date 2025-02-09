import ts from 'typescript';

export type OperatorDescription = {
  name: string;
  operators: SubOperatorDescription[];
  parameters: ParameterDescription[];
};
export type SubOperatorDescription = { name: string; importDeclaration: ImportDeclaration | undefined };
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
