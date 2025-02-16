import { map, Observable } from "rxjs";
/**
 * Adds a value to each number emitted by the source Observable.
 * @param {number} value - The value to add.
 * @returns {Function<Observable<number>>} A function that takes an Observable and returns an Observable.
 */
export function add(value: number) { return (source: Observable<number>): Observable<number> => { return source.pipe(map(v => v + value)); }; }
/**
 * Subtracts a value from each number emitted by the source Observable.
 * @param {number} value - The value to subtract.
 * @returns {Function<Observable<number>>} A function that takes an Observable and returns an Observable.
 */
export function sub(value: number) { return (source: Observable<number>): Observable<number> => { return source.pipe(map(v => v - value)); }; }
/**
 * Multiplies each number emitted by the source Observable by a value.
 * @param {number} value - The value to multiply by.
 * @returns {Function<Observable<number>>} A function that takes an Observable and returns an Observable.
 */
export function multiply(value: number) { return (source: Observable<number>): Observable<number> => { return source.pipe(map(v => v * value)); }; }
/**
 * Divides each number emitted by the source Observable by a value.
 * @param {number} value - The value to divide by.
 * @returns {Function<Observable<number>>} A function that takes an Observable and returns an Observable.
 */
export function divide(value: number) { return (source: Observable<number>): Observable<number> => { return source.pipe(map(v => v / value)); }; }
/**
 * Raises each number emitted by the source Observable to the power of a value.
 * @param {number} value - The exponent value.
 * @returns {Function<Observable<number>>} A function that takes an Observable and returns an Observable.
 */
export function power(value: number) { return (source: Observable<number>): Observable<number> => { return source.pipe(map(v => Math.pow(v, value))); }; }
/**
 * Calculates the square root of each number emitted by the source Observable.
 * @returns {Function<Observable<number>>} A function that takes an Observable and returns an Observable.
 */
export function sqrt() { return (source: Observable<number>): Observable<number> => { return source.pipe(map(v => Math.sqrt(v))); }; }
/**
 * Calculates the logarithm (base 10) of each number emitted by the source Observable.
 * @returns {Function<Observable<number>>} A function that takes an Observable and returns an Observable.
 */
export function log() { return (source: Observable<number>): Observable<number> => { return source.pipe(map(v => Math.log10(v))); }; }
/**
 * Calculates the natural logarithm (base e) of each number emitted by the source Observable.
 * @returns {Function<Observable<number>>} A function that takes an Observable and returns an Observable.
 */
export function ln() { return (source: Observable<number>): Observable<number> => { return source.pipe(map(v => Math.log(v))); }; }
/**
 * Calculates the sine of each number emitted by the source Observable.
 * @returns {Function<Observable<number>>} A function that takes an Observable and returns an Observable.
 */
export function sin() { return (source: Observable<number>): Observable<number> => { return source.pipe(map(v => Math.sin(v))); }; }
/**
 * Calculates the cosine of each number emitted by the source Observable.
 * @returns {Function<Observable<number>>} A function that takes an Observable and returns an Observable.
 */
export function cos() { return (source: Observable<number>): Observable<number> => { return source.pipe(map(v => Math.cos(v))); }; }
/**
 * Calculates the tangent of each number emitted by the source Observable.
 * @returns {Function<Observable<number>>} A function that takes an Observable and returns an Observable.
 */
export function tan() { return (source: Observable<number>): Observable<number> => { return source.pipe(map(v => Math.tan(v))); }; }
