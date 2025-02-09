import { operatorA, operatorB } from './operators';
import { operatorB as operatorC } from './operators';
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
