import { hexToRgba } from './colorUtils';

describe('hexToRgba', () => {
  test('converts a color from hex format to rgba format', () => {
    expect(hexToRgba('#07100a', 0.8)).toBe('rgba(7, 16, 10, 0.8)');
  });
});
