import PropTypes from 'prop-types';

export const gameWithPlayProgressShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  totalPlays: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
    }),
  ).isRequired,
});

export const ratingColorsShape = PropTypes.shape({
  1: PropTypes.string.isRequired,
  2: PropTypes.string.isRequired,
  3: PropTypes.string.isRequired,
  4: PropTypes.string.isRequired,
  5: PropTypes.string.isRequired,
  6: PropTypes.string.isRequired,
  7: PropTypes.string.isRequired,
  8: PropTypes.string.isRequired,
  9: PropTypes.string.isRequired,
  10: PropTypes.string.isRequired,
  undefined: PropTypes.string.isRequired,
});
