export const last = array => array[array.length - 1];

export const range = (f, l) =>
  f < l
    ? Array.from({ length: l - f + 1 }, (v, i) => i + f)
    : Array.from({ length: f - l + 1 }, (v, i) => f - i);

export const sort = array =>
  typeof array[0] === 'number' ? array.sort((a, b) => a - b) : array.sort();

export const sortBy = (array, key, direction = 'asc') => {
  if (typeof array[0][key] === 'number') {
    return direction === 'asc'
      ? array.sort((a, b) => a[key] - b[key])
      : array.sort((a, b) => b[key] - a[key]);
  }

  return direction === 'asc'
    ? array.sort((a, b) => (b[key] > a[key] ? -1 : 0))
    : array.sort((a, b) => (a[key] > b[key] ? -1 : 0));
};

export const min = array => sort(array)[0];
export const max = array => last(sort(array));
