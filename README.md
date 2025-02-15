# ts-generator

**Generate**

- from TypeScript to JSON
- from JSON to TypeScript

**JSON**

```json
{
  "imports": [
    {
      "alias": "operatorA",
      "name": "operatorA",
      "path": "./operators"
    },
    {
      "alias": "operatorB",
      "name": "operatorB",
      "path": "./operators"
    },
    {
      "alias": "operatorC",
      "name": "operatorDummy",
      "path": "./operators"
    },
    {
      "alias": "map",
      "name": "map",
      "path": "rxjs"
    },
    {
      "alias": "Observable",
      "name": "Observable",
      "path": "rxjs"
    },
    {
      "alias": "Dummy",
      "name": "Dummy",
      "path": "./types"
    }
  ],
  "operators": [
    {
      "returnType": {
        "name": "Observable",
        "type": [
          "T"
        ],
        "generic": true
      },
      "name": "foo",
      "operators": [
        {
          "name": "operatorA",
          "parameters": []
        },
        {
          "name": "operatorB",
          "parameters": [
            {
              "arrowFunction": false,
              "parameters": [
                {
                  "name": "text",
                  "threeDots": false,
                  "type": []
                }
              ]
            },
            {
              "arrowFunction": false,
              "parameters": [
                {
                  "name": "numeric",
                  "threeDots": false,
                  "type": []
                }
              ]
            }
          ]
        }
      ],
      "parameters": [
        {
          "name": "text",
          "type": "string"
        },
        {
          "name": "numeric",
          "type": "number"
        }
      ]
    },
    {
      "returnType": {
        "name": "Observable",
        "type": [
          "T"
        ],
        "generic": true
      },
      "name": "bar",
      "operators": [
        {
          "name": "operatorC",
          "parameters": [
            {
              "arrowFunction": false,
              "parameters": [
                {
                  "name": "dummy",
                  "threeDots": false,
                  "type": []
                }
              ]
            }
          ]
        }
      ],
      "parameters": [
        {
          "name": "dummy",
          "type": "Dummy"
        }
      ]
    },
    {
      "returnType": {
        "name": "Observable",
        "type": [
          "number"
        ],
        "generic": false
      },
      "name": "foobar",
      "operators": [
        {
          "name": "operatorA",
          "parameters": []
        },
        {
          "name": "operatorB",
          "parameters": [
            {
              "arrowFunction": false,
              "parameters": [
                {
                  "name": "text",
                  "threeDots": false,
                  "type": []
                }
              ]
            },
            {
              "arrowFunction": false,
              "parameters": [
                {
                  "name": "numeric",
                  "threeDots": false,
                  "type": []
                }
              ]
            }
          ]
        },
        {
          "name": "operatorC",
          "parameters": [
            {
              "arrowFunction": false,
              "parameters": [
                {
                  "name": "dummy",
                  "threeDots": false,
                  "type": []
                }
              ]
            }
          ]
        }
      ],
      "parameters": [
        {
          "name": "text",
          "type": "string"
        },
        {
          "name": "numeric",
          "type": "number"
        },
        {
          "name": "dummy",
          "type": "Dummy"
        }
      ],
      "docType": {
        "description": "foobar description",
        "params": [
          {
            "name": "text",
            "type": "string",
            "description": "String Property"
          },
          {
            "name": "numeric",
            "type": "number",
            "description": "Numeric Property"
          },
          {
            "name": "dummy",
            "type": "dummy",
            "description": "Dummy Property"
          }
        ],
        "returns": {
          "name": "Observable",
          "description": "Return Value",
          "type": [
            "number"
          ]
        }
      }
    },
    {
      "returnType": {
        "name": "Observable",
        "type": [
          "number"
        ],
        "generic": false
      },
      "name": "functionExpressions",
      "operators": [
        {
          "name": "map",
          "parameters": [
            {
              "arrowFunction": true,
              "parameters": [
                {
                  "threeDots": false,
                  "name": "v",
                  "type": []
                }
              ],
              "body": {
                "block": false,
                "content": [
                  "numeric + v"
                ]
              }
            }
          ]
        },
        {
          "name": "map",
          "parameters": [
            {
              "arrowFunction": true,
              "parameters": [
                {
                  "threeDots": false,
                  "name": "v",
                  "type": []
                }
              ],
              "body": {
                "block": true,
                "content": [
                  "return numeric + v"
                ]
              }
            }
          ]
        },
        {
          "name": "map",
          "parameters": [
            {
              "arrowFunction": false,
              "parameters": [
                {
                  "threeDots": false,
                  "name": "v",
                  "type": []
                }
              ],
              "body": {
                "block": true,
                "content": [
                  "return numeric + v"
                ]
              },
              "type": "any"
            }
          ]
        }
      ],
      "parameters": [
        {
          "name": "numeric",
          "type": "number"
        }
      ]
    }
  ]
}
```

**TypeScript**

```ts
import { operatorA, operatorB, operatorDummy as operatorC } from "./operators";
import { map, Observable } from "rxjs";
import { Dummy } from "./types";
export function foo<T>(text: string, numeric: number) { return (source: Observable<T>): Observable<T> => { return source.pipe(operatorA(), operatorB(text, numeric)); }; }
export function bar<T>(dummy: Dummy) { return (source: Observable<T>): Observable<T> => { return source.pipe(operatorC(dummy)); }; }
/**
 * foobar description
 * @param {string} text String Property
 * @param {number} numeric Numeric Property
 * @param {dummy} dummy Dummy Property
 * @returns {Observable<number>} Return Value
 */
export function foobar(text: string, numeric: number, dummy: Dummy) { return (source: Observable<number>): Observable<number> => { return source.pipe(operatorA(), operatorB(text, numeric), operatorC(dummy)); }; }
export function functionExpressions(numeric: number) { return (source: Observable<number>): Observable<number> => { return source.pipe(map(v => numeric + v), map(v => { return numeric + v; }), map(function (v) { return numeric + v; })); }; }
```

## Development

### Setup

```bash
npm install
```

### Parse

```bash
npm run dev:parse
```

### Build

```bash
npm run dev:build
```
