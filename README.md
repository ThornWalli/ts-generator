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
              "name": "text"
            },
            {
              "name": "numeric"
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
              "name": "dummy"
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
              "name": "text"
            },
            {
              "name": "numeric"
            }
          ]
        },
        {
          "name": "operatorC",
          "parameters": [
            {
              "name": "dummy"
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
      ]
    }
  ]
}
```

**TypeScript**

```ts
import { operatorA, operatorB, operatorDummy as operatorC } from "./operators";
import { Observable } from "rxjs";
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
