import { last, range, sort, sortBy, min, max } from './arrayUtils';

describe('last', () => {
  test('returns the last element of the array', () => {
    expect(last(['a', 'b', 'c', 'd'])).toBe('d');
  });
});

describe('range(f, l)', () => {
  test('returns an array of the range from f to l (inclusive)', () => {
    expect(range(3, 7)).toEqual([3, 4, 5, 6, 7]);
  });
});

describe('sort', () => {
  test('can sort an array of numbers', () => {
    expect(sort([3, 7, -8, 11, 4])).toEqual([-8, 3, 4, 7, 11]);
  });

  test('can sort an array of strings', () => {
    expect(sort(['b', 'aa', 'c', 'a'])).toEqual(['a', 'aa', 'b', 'c']);
  });
});

describe('sortBy', () => {
  test('can sort an array of object in ascending order using numbers', () => {
    expect(sortBy([{ v: 3 }, { v: 11 }, { v: -8 }], 'v')).toEqual([
      { v: -8 },
      { v: 3 },
      { v: 11 },
    ]);
  });

  test('can sort an array of object in descending order using numbers', () => {
    expect(sortBy([{ v: 3 }, { v: 11 }, { v: -8 }], 'v', 'desc')).toEqual([
      { v: 11 },
      { v: 3 },
      { v: -8 },
    ]);
  });

  test('can sort an array of object in ascending order using strings', () => {
    expect(sortBy([{ v: 'a' }, { v: 'c' }, { v: 'b' }], 'v')).toEqual([
      { v: 'a' },
      { v: 'b' },
      { v: 'c' },
    ]);
  });

  test('can sort an array of object in descending order using strings', () => {
    expect(sortBy([{ v: 'a' }, { v: 'c' }, { v: 'b' }], 'v', 'desc')).toEqual([
      { v: 'c' },
      { v: 'b' },
      { v: 'a' },
    ]);
  });
});

describe('min', () => {
  test('returns the minimum value of an array of numbers', () => {
    expect(min([1, -2, 3])).toBe(-2);
  });

  test('returns the minimum value of an array of string', () => {
    expect(min(['c', 'a', 'b'])).toBe('a');
  });
});

describe('max', () => {
  test('returns the maximum value of an array of numbers', () => {
    expect(max([1, -2, 3])).toBe(3);
  });

  test('returns the maximum value of an array of string', () => {
    expect(max(['c', 'a', 'b'])).toBe('c');
  });
});
