export const hexToRgba = (hex, opacity = 1) =>
  `${[hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].reduce(
    (acc, d) => `${acc}${parseInt(d, 16)}, `,
    'rgba(',
  )}${opacity})`;

const toRgb = color => ({
  r: color.substring(1, 3),
  g: color.substring(3, 5),
  b: color.substring(5, 7),
});

const toDecNumber = hexString => Number(`0x${hexString}`);
const toHexString = decNumber => {
  const s = `0${decNumber.toString(16)}`;
  return s.substring(s.length - 2);
};

export const mix = (a, b, percentageOfA) => {
  const rgbA = toRgb(a);
  const rgbB = toRgb(b);
  return ['r', 'g', 'b'].reduce(
    (acc, key) =>
      acc +
      toHexString(
        Math.round(
          (toDecNumber(rgbA[key]) * percentageOfA +
            toDecNumber(rgbB[key]) * (100 - percentageOfA)) /
            100,
        ),
      ),
    '#',
  );
};
