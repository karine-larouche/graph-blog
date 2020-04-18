import { isValid, format, addMonths } from 'date-fns';
import { last } from '../../../utils/arrayUtils';
import { playAmountBreakdown } from './utils';

const formatMonth = date => format(date, 'yyyy-MM');

const missingMonths = (lastEntryMonth, currentMonth) => {
  const result = [];

  let month = new Date(`${lastEntryMonth}-01T00:00`);
  do {
    month = addMonths(month, 1);
    result.push(formatMonth(month));
  } while (formatMonth(month) !== currentMonth);

  return result;
};

const addMissingMonths = (playsOverTime, currentMonth) => {
  const lastEntry = last(playsOverTime);
  if (lastEntry.month !== currentMonth) {
    playsOverTime.push(
      ...missingMonths(lastEntry.month, currentMonth).map(m => ({
        month: m,
        totalPlays: { ...lastEntry.totalPlays },
      })),
    );
  }
};

const emptyPlayGroups = () =>
  Object.fromEntries(playAmountBreakdown.map(c => [c, 0]));

const playGroupIndex = numPlays => {
  if (numPlays === 1) return '1 play';
  if (numPlays < 10) return `${numPlays} plays`;
  if (numPlays < 25) return '10-25 plays';
  return '25+ plays';
};

const groupTotalPlays = totalPlaysPerGame => {
  const grouped = emptyPlayGroups();
  Object.values(totalPlaysPerGame).forEach(quantity => {
    grouped[playGroupIndex(quantity)] += 1;
  });
  return grouped;
};

export default plays => {
  const totalPlaysPerGamePerMonth = plays.reduceRight(
    (playsOverTime, play) => {
      if (isValid(new Date(play.date)) && play.quantity !== 0) {
        const month = formatMonth(new Date(`${play.date}T00:00`));
        addMissingMonths(playsOverTime, month);

        const currentEntryGames = last(playsOverTime).totalPlays;
        currentEntryGames[play.name] = currentEntryGames[play.name] || 0;
        currentEntryGames[play.name] += play.quantity;
      }
      return playsOverTime;
    },
    [{ month: formatMonth(new Date(last(plays).date)), totalPlays: {} }],
  );

  const currentMonth = formatMonth(new Date());
  addMissingMonths(totalPlaysPerGamePerMonth, currentMonth);

  return totalPlaysPerGamePerMonth.map(entry => ({
    month: entry.month,
    ...groupTotalPlays(entry.totalPlays),
  }));
};
