import { map, Observable } from 'rxjs';

export function operatorA(value: number) {
  return (source: Observable<number>): Observable<number> => source.pipe(map(() => value));
}
