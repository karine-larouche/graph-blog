import { isValid } from 'date-fns';
import { sort } from '../../../utils/arrayUtils';

export default plays => {
  const totalPlaysPerGame = plays.reduceRight((totalPlays, play) => {
    if (isValid(new Date(play.date)) && play.quantity !== 0) {
      // eslint-disable-next-line no-param-reassign
      totalPlays[play.name] = (totalPlays[play.name] || 0) + play.quantity;
    }
    return totalPlays;
  }, {});

  return sort(Object.values(totalPlaysPerGame), 'desc');
};
