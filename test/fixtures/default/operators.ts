import { tap } from 'rxjs';
import { Dummy } from './types';

const empty = source => source;
export function operatorA() {
  return empty;
}
export function operatorB(text: string, numeric: number) {
  return source => source.pipe(tap(() => console.log({ text, numeric })));
}
export function operatorDummy(dummy: Dummy) {
  return source => source.pipe(tap(() => console.log(dummy)));
}
