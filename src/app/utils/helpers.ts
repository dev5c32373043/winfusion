export const isArray = Array.isArray;
export const isNumber = (obj): boolean => typeof obj === 'number' && Number.isFinite(obj);
export const isString = (str): boolean => typeof str === 'string';
export const isBoolean = (obj): boolean => typeof obj === 'boolean';
export const isPlainObject = (obj): boolean =>
  typeof obj === 'object' && obj !== null && !isArray(obj) && obj.toString() === '[object Object]';
export const isFunction = (fn): boolean => typeof fn === 'function';
export const isNull = (obj): boolean => obj === null;
export const isDate = (obj): boolean => !isNull(obj) && new Date(obj).toString() !== 'Invalid Date';
export const isUndefined = (obj): boolean => obj === undefined;
export const isCollection = (obj): boolean => isArray(obj) || isPlainObject(obj);

export const isEmpty = (obj): boolean => {
  if (isNumber(obj)) return false;
  if (isArray(obj)) return !obj.length;
  if (isPlainObject(obj)) return !Object.keys(obj).length;
  if (isString(obj)) return !obj.length;
  return true;
};

export const safeParseJson = (jsonStr: string, defaultVal = {}) => {
  try {
    const json = JSON.parse(jsonStr);
    return json;
  } catch (e) {
    return defaultVal;
  }
};

export async function to<T>(promise: Promise<T>): Promise<[null, T] | [Error]> {
  return promise.then<[null, T]>((data: T) => [null, data]).catch<[Error]>((err: Error) => [err]);
}

export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const selected: Partial<T> = {};

  keys.forEach(key => {
    if (obj.hasOwnProperty(key)) {
      selected[key] = obj[key];
    }
  });

  return selected as Pick<T, K>;
}

export const shortNumber = (num: number): string => {
  const formatter = Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  });

  return formatter.format(num);
};

export const isMongoId = (str: string): boolean => str && /^[0-9a-fA-F]{24}$/.test(str);

export const isSSR = (): boolean => typeof window === 'undefined';
