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
              "threeDots": false,
              "arrowFunction": false,
              "type": [],
              "parameters": [
                {
                  "arrowFunction": false,
                  "name": "text",
                  "threeDots": false,
                  "type": [],
                  "parameters": []
                }
              ]
            },
            {
              "threeDots": false,
              "arrowFunction": false,
              "type": [],
              "parameters": [
                {
                  "arrowFunction": false,
                  "name": "numeric",
                  "threeDots": false,
                  "type": [],
                  "parameters": []
                }
              ]
            }
          ]
        }
      ],
      "parameters": [
        {
          "arrowFunction": false,
          "threeDots": false,
          "name": "text",
          "type": [
            "string"
          ],
          "parameters": []
        },
        {
          "arrowFunction": false,
          "threeDots": false,
          "name": "numeric",
          "type": [
            "number"
          ],
          "parameters": []
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
              "threeDots": false,
              "arrowFunction": false,
              "type": [],
              "parameters": [
                {
                  "arrowFunction": false,
                  "name": "dummy",
                  "threeDots": false,
                  "type": [],
                  "parameters": []
                }
              ]
            }
          ]
        }
      ],
      "parameters": [
        {
          "arrowFunction": false,
          "threeDots": false,
          "name": "dummy",
          "type": [
            "Dummy"
          ],
          "parameters": []
        }
      ]
    },
    {
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
      },
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
              "threeDots": false,
              "arrowFunction": false,
              "type": [],
              "parameters": [
                {
                  "arrowFunction": false,
                  "name": "text",
                  "threeDots": false,
                  "type": [],
                  "parameters": []
                }
              ]
            },
            {
              "threeDots": false,
              "arrowFunction": false,
              "type": [],
              "parameters": [
                {
                  "arrowFunction": false,
                  "name": "numeric",
                  "threeDots": false,
                  "type": [],
                  "parameters": []
                }
              ]
            }
          ]
        },
        {
          "name": "operatorC",
          "parameters": [
            {
              "threeDots": false,
              "arrowFunction": false,
              "type": [],
              "parameters": [
                {
                  "arrowFunction": false,
                  "name": "dummy",
                  "threeDots": false,
                  "type": [],
                  "parameters": []
                }
              ]
            }
          ]
        }
      ],
      "parameters": [
        {
          "arrowFunction": false,
          "threeDots": false,
          "name": "text",
          "type": [
            "string"
          ],
          "parameters": []
        },
        {
          "arrowFunction": false,
          "threeDots": false,
          "name": "numeric",
          "type": [
            "number"
          ],
          "parameters": []
        },
        {
          "arrowFunction": false,
          "threeDots": false,
          "name": "dummy",
          "type": [
            "Dummy"
          ],
          "parameters": []
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
      "name": "functionExpressions",
      "operators": [
        {
          "name": "map",
          "parameters": [
            {
              "threeDots": false,
              "arrowFunction": true,
              "type": [],
              "parameters": [
                {
                  "arrowFunction": false,
                  "threeDots": false,
                  "name": "v",
                  "type": [],
                  "parameters": []
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
              "threeDots": false,
              "arrowFunction": true,
              "type": [],
              "parameters": [
                {
                  "arrowFunction": false,
                  "threeDots": false,
                  "name": "v",
                  "type": [],
                  "parameters": []
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
              "threeDots": false,
              "arrowFunction": false,
              "type": [],
              "parameters": [
                {
                  "arrowFunction": false,
                  "threeDots": false,
                  "name": "v",
                  "type": [],
                  "parameters": []
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
        }
      ],
      "parameters": [
        {
          "arrowFunction": false,
          "threeDots": false,
          "name": "numeric",
          "type": [
            "number"
          ],
          "parameters": []
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
