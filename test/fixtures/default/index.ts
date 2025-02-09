import { operatorA, operatorB, operatorDummy as operatorC } from "./operators";
import { Observable } from "rxjs";
import { Dummy } from "./types";
export function foo<T>(text: string, numeric: number) { return (source: Observable<T>): Observable<T> => { return source.pipe(operatorA(), operatorB(text, numeric)); }; }
export function bar<T>(dummy: Dummy) { return (source: Observable<T>): Observable<T> => { return source.pipe(operatorC(dummy)); }; }
/**
 * foobar description
 * @param {string} text
 * @param {number} numeric
 * @param {dummy} dummy
 * @returns {Observable<number>}
 */
export function foobar(text: string, numeric: number, dummy: Dummy) { return (source: Observable<number>): Observable<number> => { return source.pipe(operatorA(), operatorB(text, numeric), operatorC(dummy)); }; }
