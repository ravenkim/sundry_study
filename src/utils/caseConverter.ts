export function toCamelCase(snakeCaseObject: any): any {
  if (typeof snakeCaseObject !== 'object' || snakeCaseObject === null) {
    return snakeCaseObject;
  }

  if (Array.isArray(snakeCaseObject)) {
    return snakeCaseObject.map((item) => toCamelCase(item));
  }

  return Object.keys(snakeCaseObject).reduce((result, key) => {
    const camelCaseKey = key.replace(/([-_][a-z])/gi, (matches) =>
      matches.toUpperCase().replace('-', '').replace('_', ''),
    );
    result[camelCaseKey] = toCamelCase(snakeCaseObject[key]);
    return result;
  }, {});
}