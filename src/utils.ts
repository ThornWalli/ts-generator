export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result: Record<string, T[]>, value) => {
    const keyValue = String(value[key]);
    if (!result[keyValue]) {
      result[keyValue] = [];
    }
    result[keyValue].push(value);
    return result;
  }, {});
}
