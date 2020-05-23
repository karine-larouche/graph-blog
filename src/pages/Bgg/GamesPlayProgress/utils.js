import PropTypes from 'prop-types';

// eslint-disable-next-line import/prefer-default-export
export const gameWithPlayProgressShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  totalPlays: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
    }),
  ).isRequired,
});
