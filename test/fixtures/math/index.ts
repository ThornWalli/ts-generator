import { Observable } from 'rxjs';
import { add } from './operators';

export function simpleAddition(value: number) {
  return (source: Observable<number>): Observable<number> => {
    return source.pipe(add(value));
  };
}
