import { operatorA, operatorB, operatorDummy as operatorC } from "./operators";
import { map, Observable } from "rxjs";
import { Dummy } from "./types";
export function foo<T>(text: string, numeric: number) { return (source: Observable<T>): Observable<T> => { return source.pipe(operatorA(), operatorB(text, numeric)); }; }
export function bar<T>(dummy: Dummy) { return (source: Observable<T>): Observable<T> => { return source.pipe(operatorC(dummy)); }; }
/**
 * foobar description
 * @param {string} text String Property
 * @param {number} numeric Numeric Property
 * @param {dummy} dummy Dummy Property
 * @returns {Observable<number>} Return Value
 */
export function foobar(text: string, numeric: number, dummy: Dummy) { return (source: Observable<number>): Observable<number> => { return source.pipe(operatorA(), operatorB(text, numeric), operatorC(dummy)); }; }
export function functionExpressions(numeric: number) { return (source: Observable<number>): Observable<number> => { return source.pipe(map(v => numeric + v), map(v => { return numeric + v; }), map(function (v) { return numeric + v; })); }; }
