export const last = array => array[array.length - 1];

export const range = (f, l) =>
  Array.from({ length: l - f + 1 }, (v, i) => i + f);

export const sortBy = (array, key) => array.sort((a, b) => b[key] - a[key]);
