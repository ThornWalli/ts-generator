import ts from 'typescript';

export type Configuration = {
  imports: ImportDeclaration[];
  operators: OperatorDescription[];
};

export type ReturnType = {
  type: TYPE_DEFINITION | string;
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
  parameters: ParameterDescription[];
};
export type ParameterDescription = { name: string; type: string };

export type ImportDeclaration = {
  alias: string;
  name: string;
  path: string;
};

export type ParsedOperatorDescription = {
  function: ts.FunctionDeclaration;
  imports: ImportDeclaration[];
};
export enum TYPE_DEFINITION {
  Number = 'number',
  String = 'string',
  Boolean = 'boolean',
  Generic = 'T'
}
