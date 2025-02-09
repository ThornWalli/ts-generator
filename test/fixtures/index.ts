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
