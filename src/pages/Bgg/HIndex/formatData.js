import { isValid, getYear } from 'date-fns';
import { last, range, sortBy } from '../../../utils/arrayUtils';

const isNotAfterYear = (date, year) => getYear(new Date(date)) <= year;

const getTotalPlaysUntilYear = (plays, year) => {
  const totalPlaysPerGame = plays.reduceRight((totalPlays, play) => {
    if (isNotAfterYear(play.date, year) && play.quantity !== 0) {
      // eslint-disable-next-line no-param-reassign
      totalPlays[play.name] = (totalPlays[play.name] || 0) + play.quantity;
    }
    return totalPlays;
  }, {});

  return sortBy(
    Object.entries(totalPlaysPerGame).map(([name, numberOfPlays]) => ({
      name,
      numberOfPlays,
    })),
    'numberOfPlays',
    'desc',
  );
};

export const removeInvalidDates = plays =>
  plays.filter(p => isValid(new Date(p.date)));

export const formatTotalPlaysYear = plays => {
  const yearOfFirstPlay = getYear(new Date(last(plays).date));
  const currentYear = getYear(new Date());

  return range(yearOfFirstPlay, currentYear).map(y => ({
    year: y,
    totalPlays: getTotalPlaysUntilYear(plays, y),
  }));
};
