export const last = array => array[array.length - 1];

export const range = (f, l) =>
  Array.from({ length: l - f + 1 }, (v, i) => i + f);

export const sort = array => array.sort((a, b) => a - b);
export const sortBy = (array, key) => array.sort((a, b) => b[key] - a[key]);

export const min = array => sort(array)[0];
export const max = array => last(sort(array));
