import { Observable, tap } from 'rxjs';
import { Dummy } from './types';
import { emptyOperator } from '../../utils';

export function operatorA() {
  return emptyOperator;
}
export function operatorB<T>(text: string, numeric: number) {
  return (source: Observable<T>) => source.pipe(tap(() => console.log({ text, numeric })));
}
export function operatorDummy<T>(dummy: Dummy) {
  return (source: Observable<T>) => source.pipe(tap(() => console.log(dummy)));
}
