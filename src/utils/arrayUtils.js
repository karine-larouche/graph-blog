export const last = array => array[array.length - 1];

export const range = (f, l) =>
  Array.from({ length: l - f + 1 }, (v, i) => i + f);

export const sort = array =>
  array.length > 1 && !Number.isNaN(array[0] - array[1])
    ? array.sort((a, b) => a - b)
    : array.sort();

export const sortBy = (array, key) => array.sort((a, b) => b[key] - a[key]);

export const min = array => sort(array)[0];
export const max = array => last(sort(array));
