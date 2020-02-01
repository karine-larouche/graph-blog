import React from 'react';
import PropTypes from 'prop-types';
import { last } from '../../../utils/arrayUtils';

const groupByGame = plays => {
  const playsByGame = plays.reduceRight((games, play) => {
    const game = games[play.name];
    if (game) {
      game.totalPlays.push({
        date: play.date,
        total: last(game.totalPlays).total + play.quantity,
      });
    } else {
      // eslint-disable-next-line no-param-reassign
      games[play.name] = {
        name: play.name,
        totalPlays: [{ date: play.date, total: play.quantity }],
      };
    }
    return games;
  }, {});
  return Object.values(playsByGame);
};

const GamesPlayProgress = ({ isFetching, hasError, plays, username }) => {
  if (isFetching) return `Fetching games for ${username}...`;
  if (hasError) return 'An error occured... sorry!';
  if (!plays) return 'Enter your bgg username to view your plays.';
  if (plays.length === 0) return 'Log your plays on bgg to see this chart.';

  const playsPerGame = groupByGame(plays);
  console.log(playsPerGame);

  return <></>;
};

GamesPlayProgress.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  plays: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  username: PropTypes.string.isRequired,
};

GamesPlayProgress.defaultProps = {
  plays: undefined,
};

export default GamesPlayProgress;
