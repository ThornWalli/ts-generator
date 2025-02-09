# ts-generator

**Generate**

- from TypeScript to JSON
- from JSON to TypeScript

From JSON:

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
        "type": "T",
        "generic": true
      },
      "name": "foo",
      "operators": [
        {
          "parameters": [],
          "name": "operatorA"
        },
        {
          "parameters": [
            {
              "name": "text"
            },
            {
              "name": "numeric"
            }
          ],
          "name": "operatorB"
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
        "type": "T",
        "generic": true
      },
      "name": "bar",
      "operators": [
        {
          "parameters": [
            {
              "name": "dummy"
            }
          ],
          "name": "operatorC"
        }
      ],
      "parameters": [
        {
          "name": "dummy",
          "type": "Dummy"
        }
      ]
    }
  ]
}
```

to TypeScript:

```ts
import { operatorA, operatorB, operatorDummy as operatorC } from './operators';
import { Observable } from 'rxjs';
import { Dummy } from './types';
export function foo<T>(text: string, numeric: number) {
  return (source: Observable<T>): Observable<T> => {
    return source.pipe(operatorA(), operatorB(text, numeric));
  };
}
export function bar<T>(dummy: Dummy) {
  return (source: Observable<T>): Observable<T> => {
    return source.pipe(operatorC(dummy));
  };
}

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
