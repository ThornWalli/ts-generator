import ts from 'typescript';

export type Configuration = {
  imports: ImportDeclaration[];
  operators: OperatorDescription[];
};

export type TypeDescription = {
  name: TYPE_DEFINITION;
  type: TypeDescription[] | undefined;
};

export type TYPE_DEFINITION = TYPE_DEFINITIONS | string;

export type OperatorType = {
  name: string;
  type: TypeDescription[];
};
export type OperatorParameter = {
  name: string;
  type: TypeDescription[];
};

export type OperatorDescription = {
  returnType: OperatorType | undefined;
  parameterType: OperatorParameter | undefined;
  typeParameters: string[];
  name: string | undefined;
  operators: SubOperatorDescription[];
  parameters: ParameterDescription[];
  docType: DocTypeDescription | undefined;
};
export type SubOperatorDescription = {
  name: string;
  parameters: ParameterDescription[];
};
export type ParameterDescription = {
  threeDots: boolean;
  arrowFunction: boolean;
  name: string | undefined;
  type: string[];
  parameters: ParameterDescription[];
  body:
    | {
        block: boolean;
        content: string[];
      }
    | undefined;
};

export type ImportDeclaration = {
  alias: string;
  name: string;
  path: string;
};

export type ParsedOperatorDescription = {
  function: ts.FunctionDeclaration;
  imports: ImportDeclaration[];
};
export enum TYPE_DEFINITIONS {
  Number = 'number',
  String = 'string',
  Boolean = 'boolean',
  Generic = 'T',
  Any = 'any'
}

export type DocTypeParamDescription = {
  name: string;
  type: string;
  description: string | undefined;
};
export type DocTypeDescription = {
  description: string | undefined;
  params: DocTypeParamDescription[];
  returns:
    | {
        name: string;
        description: string | undefined;
        type: string[];
      }
    | undefined;
};
