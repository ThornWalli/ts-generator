import { Observable } from "rxjs";
import { add } from "./operators";
/**
 * Simple addition
 * @param {number} value Value to add
 * @returns {Observable<number>} Return Value
 */
export function simpleAddition(value: number) { return (source: Observable<number>): Observable<number> => { return source.pipe(add(value)); }; }
