# ts-generator

Just a test…

From JSON:

```json
[
  {
    "name": "foo",
    "operators": [
      {
        "name": "operatorA",
        "importDeclaration": {
          "local": "operatorA",
          "imported": "operatorA",
          "path": "./operators"
        }
      },
      {
        "name": "operatorB",
        "importDeclaration": {
          "local": "operatorB",
          "imported": "operatorB",
          "path": "./operators"
        }
      },
      {
        "name": "operatorC",
        "importDeclaration": {
          "local": "operatorC",
          "imported": "operatorC",
          "path": "./operators"
        }
      }
    ],
    "parameters": []
  },
  {
    "name": "bar",
    "operators": [
      {
        "name": "operatorA",
        "importDeclaration": {
          "local": "operatorA",
          "imported": "operatorA",
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
import { operatorA, operatorB, operatorC } from './operators';
import { Observable } from 'rxjs';
export function foo<T>() {
  return (source: Observable<T>): Observable<T> => {
    return source.pipe(operatorA(), operatorB(), operatorC());
  };
}
export function bar<T>() {
  return (source: Observable<T>): Observable<T> => {
    return source.pipe(operatorA());
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
