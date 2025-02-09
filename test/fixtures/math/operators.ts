import { map, Observable } from 'rxjs/';

export function add(value: number) {
  return (source: Observable<number>): Observable<number> => source.pipe(map(v => v + value));
}
export function sub(value: number) {
  return (source: Observable<number>): Observable<number> => source.pipe(map(v => v - value));
}
export function multiply(value: number) {
  return (source: Observable<number>): Observable<number> => source.pipe(map(v => v * value));
}
export function divide(value: number) {
  return (source: Observable<number>): Observable<number> => source.pipe(map(v => v / value));
}
