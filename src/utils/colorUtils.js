// eslint-disable-next-line import/prefer-default-export
export const hexToRgba = (hex, opacity = 1) =>
  `${[hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].reduce(
    (acc, d) => `${acc}${parseInt(d, 16)}, `,
    'rgba(',
  )}${opacity})`;
