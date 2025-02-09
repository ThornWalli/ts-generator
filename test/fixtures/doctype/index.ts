import { Observable } from "rxjs";
import { operatorA } from "./operators";
/**
 * Function Description
 * @param {number} value Property Description
 * @returns {Observable<number>} Return Description
 */
export function operator(value: number) { return (source: Observable<number>): Observable<number> => { return source.pipe(operatorA()); }; }
