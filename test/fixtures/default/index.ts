import { operatorA, operatorB } from './operators';
import { operatorDummy as operatorC } from './operators';
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
