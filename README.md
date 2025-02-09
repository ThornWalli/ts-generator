# ts-generator

**Generate**

- from TypeScript to JSON
- from JSON to TypeScript

From JSON:

```json
[
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
        "name": "operatorA",
        "importDeclaration": {
          "local": "operatorA",
          "imported": "operatorA",
          "path": "./operators"
        }
      },
      {
        "parameters": [],
        "name": "operatorB",
        "importDeclaration": {
          "local": "operatorB",
          "imported": "operatorB",
          "path": "./operators"
        }
      }
    ],
    "parameters": []
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
        "parameters": [],
        "name": "operatorC",
        "importDeclaration": {
          "local": "operatorC",
          "imported": "operatorB",
          "path": "./operators"
        }
      }
    ],
    "parameters": []
  }
]
```

to TypeScript:

```ts
import { operatorA, operatorB, operatorB as operatorC } from './operators';
import { Observable } from 'rxjs';
export function foo<T>() {
  return (source: Observable<T>): Observable<T> => {
    return source.pipe(operatorA(), operatorB());
  };
}
export function bar<T>() {
  return (source: Observable<T>): Observable<T> => {
    return source.pipe(operatorC());
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
