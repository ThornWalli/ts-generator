import { concatMap, map, Observable } from "rxjs";
import { operatorA, operatorB } from "./operators";
export function test() { return (source: Observable<number>): Observable<number> => { return source.pipe(map((value: number): number => value + 1), map((value: number): number => { return value + 1; }), map(function (value: number): number { return value + 1; })); }; }
export function test2() { return (source: Observable<number>): Observable<number> => { return source.pipe(map((value: number): number => { value = Math.pow(value, 2); return value + 1; })); }; }
export function test3() { return (source: Observable<number>): Observable<number> => { return source.pipe(map((...list: [
    number,
    number
]): number => { return list[0]; })); }; }
export function foo<T>(text: string, numeric: number) { return (source: Observable<T>): Observable<T> => { return source.pipe(operatorA(), operatorB(text, numeric)); }; }
