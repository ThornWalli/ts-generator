export function groupBy<T>(array: T[], key: keyof T, options: { unique: boolean }): Record<string, T[]> {
  return array.reduce((result: Record<string, T[]>, value) => {
    const keyValue = String(value[key]);
    if (!result[keyValue]) {
      result[keyValue] = [];
    }
    if (!options.unique || (options.unique && !result[keyValue].includes(value))) {
      result[keyValue].push(value);
    }
    return result;
  }, {});
}

export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter(item => {
    const keyValue = item[key];
    if (seen.has(keyValue)) {
      return false;
    }
    seen.add(keyValue);
    return true;
  });
}

export function getFixture() {
  return process.env.npm_config_fixture || process.env.DEBUG_FIXTURE || 'default';
}
