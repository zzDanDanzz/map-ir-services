/** Determines value is not undefined or null. */
export const isValue = <T>(value: T | undefined | null): value is T =>
  (value as T) !== undefined && (value as T) !== null;

type NonNullableProp<T, Cond> = {
  [P in keyof T]: Exclude<T[P], Cond>;
};

/** Cleans Object from undefined, null (normal), and also falsy valus (strict) */
export const cleanObj = <T extends Record<string, unknown>>(
  obj: T,
  strict = true
) =>
  Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => (strict ? Boolean(v) : isValue(v)))
  ) as NonNullableProp<T, undefined | null>;

/** Converts string-likes to number. */
export const toNumber = (s: string | number) =>
  typeof s === 'string' ? parseFloat(s) : s;

/** Removes anything other than numbers from a string. useful for number inputs */
export const toNumberString = (str: string) =>
  str
    .split('')
    .map((c) => parseFloat(c))
    .filter((i) => !Number.isNaN(i))
    .join('');

/** Formats number using built-in Intl */
export const intlNumberFormat = (
  s: string | number,
  options: Intl.NumberFormatOptions = {}
) =>
  new Intl.NumberFormat('fa-IR', { useGrouping: false, ...options }).format(
    toNumber(s)
  );

/** Converts numbers in a string to Farsi (persian) numebrs */
export const toFaDigits = function (input: string | number) {
  input = input.toString();
  if (!input) return '';
  const id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return input.replace(/[0-9]/g, function (w) {
    return id[+w];
  });
};

/** Converts numbers in a string to English numebrs */
export const toEnDigits = function (input: string | number) {
  input = input.toString();
  if (!input) return '';
  return input.replace(/[۰-۹]/g, function (chr) {
    const persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return persian.indexOf(chr).toString();
  });
};

/** converts all properties of an object to string, using .toString method. */
export const convertAllPropsToString = (obj: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, String(value)])
  ) as Record<string, string>;

/** Generates a Url Query from a given object */
type StringConvetable = unknown & { toString(): string };
export const qs = <T extends Record<string, StringConvetable>>(obj: T) =>
  new URLSearchParams(convertAllPropsToString(cleanObj(obj))).toString();

/** Parses query string to object, if no query is given, `window.location.search` is used */
export const qsParse = (query?: string) =>
  Object.fromEntries(new URLSearchParams(query ?? window.location.search));

/** Promisified Geolocation API */
export const findMyLocation = () =>
  new Promise<GeolocationPosition>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('Geolocation is not supported by your browser');
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 3000,
        maximumAge: 0,
      });
    }
  });

/** Function to Opens download prompt to save given link */
export const downloadThisLink = (url: string, name = '') => {
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.download = name;

  document.body.appendChild(link);

  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );

  document.body.removeChild(link);
};

/** downloads given blob using {@link downloadThisLink} */
export const downloadBlob = (blob: Blob, name = '') => {
  const blobUrl = URL.createObjectURL(blob);
  downloadThisLink(blobUrl);
};

interface ITableCellSpec {
  id: string;
  rows: number;
  columns: number;
  origin: { rowIndex: number; cellIndex: number };
}

/** Generates an object describing a table row and cells (with `colspan` an `rowspan` support) from a text representing cells like CSS grid areas.
 */
export const areaToTableSpec = (arr: string[][]) => {
  const output: ITableCellSpec[][] = [];

  arr.forEach((row, rowIndex) => {
    output[rowIndex] = [];

    return row.forEach((cell, cellIndex) => {
      const d = output.flat().find((i: ITableCellSpec) => i.id === cell);
      if (!d) {
        output[rowIndex].push({
          id: cell,
          columns: 1,
          rows: 1,
          origin: { rowIndex, cellIndex },
        });
      } else {
        if (rowIndex + 1 - d.origin.rowIndex > d.rows) d.rows++;
        if (cellIndex + 1 - d.origin.cellIndex > d.columns) d.columns++;
      }
    });
  });

  return output;
};

export const groupBy = <T extends Record<string, unknown>>(
  items: T[],
  key: keyof T
): Record<keyof T, T[]> =>
  items.reduce(
    (result, item) => ({
      ...result,
      [item[key] as string]: [...(result[item[key]] || []), item],
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    {} as any
  );

export const groupBySingular = <T extends Record<string, unknown>>(
  items: T[],
  key: string
): Record<string, T> =>
  items.reduce(
    (result, item) => ({
      ...result,
      [item[key] as string]: item,
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    {} as any
  );

/** Join string in persian format, using virgool "،" until the last one and then a و */
export const faJoin = (arr: unknown[]) =>
  [arr.slice(0, -1).join('، ').trim(), (arr.slice(-1)[0] as string).trim()]
    .filter(Boolean)
    .join(' و ');

/** Reverse key, value in an Object  */
export const reverseObj = (obj: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(obj).map((keyValue) => keyValue.reverse())
  ) as Record<string, string>;

/** Create OData $filter string from a given object */
export const filterString = (filterObject: Record<string, string>) =>
  Object.entries(cleanObj(filterObject, false))
    .map((i) => i.join(' eq '))
    .join(' and ');

/** Converts byte number to a more human-readable string like 23KB  */
export function bytesToSize(bytes: number) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'] as const;
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

/** Get name and extension from a filename string */
export const splitFilename = (name: string) => {
  const cutIndex = name.lastIndexOf('.');
  return [name.slice(0, cutIndex), name.slice(cutIndex)] as [string, string];
};

/** Get Valid Filename (turnes spaces to _) */
export const getValidFileName = (fileName: string) => {
  const [name, ext] = splitFilename(fileName);
  return name.replaceAll('.', '_') + ext;
};
