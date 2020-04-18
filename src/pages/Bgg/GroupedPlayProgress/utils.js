import PropTypes from 'prop-types';
import { range } from '../../../utils/arrayUtils';

export const playAmountBreakdown = [
  '25+ plays',
  '10-25 plays',
  ...range(9, 2).map(n => `${n} plays`),
  '1 play',
];

export const playGroupsForMonthShape = PropTypes.shape({
  month: PropTypes.string.isRequired,
  ...Object.fromEntries(
    playAmountBreakdown.map(c => [c, PropTypes.number.isRequired]),
  ),
});
