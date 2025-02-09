import { Observable } from 'rxjs';
import { operatorA, operatorB, operatorC } from './operators';
export function test<T>() {
  return (source: Observable<T>): Observable<T> => {
    return source.pipe(operatorA(), operatorB(), operatorC());
  };
}
