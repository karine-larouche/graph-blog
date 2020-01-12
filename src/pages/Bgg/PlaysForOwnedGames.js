import React from 'react';
import PropTypes from 'prop-types';
import { sortBy } from '../../utils/arrayUtils';

const playGroupLabels = [
  'Never played',
  '1 play',
  '2 plays',
  '3-4 plays',
  '5-9 plays',
  '10-25 plays',
  '25+ plays',
];

const playGroupIndex = numPlays => {
  if (numPlays < 3) return numPlays;
  if (numPlays >= 3 && numPlays < 5) return 3;
  if (numPlays >= 5 && numPlays < 10) return 4;
  if (numPlays >= 10 && numPlays < 25) return 5;
  return 6;
};

const groupByPlays = games => {
  const grouped = playGroupLabels.map(label => ({ label, games: [] }));
  sortBy(games, 'numPlays').forEach(game => {
    grouped[playGroupIndex(game.numPlays)].games.push(game);
  });
  return grouped;
};

const PlaysForOwnedGames = ({ isFetching, hasError, games, username }) => {
  if (isFetching) return `Fetching games for ${username}...`;
  if (hasError) return 'An error occured... sorry!';
  if (!games) return 'Enter your bgg username to view your plays.';
  if (games.length === 0)
    return "You don't have any logged plays! Log your plays on bgg to see your progress.";
  return (
    <ul>
      {groupByPlays(games).map(group => (
        <li>
          {group.label}
          <ul>
            {group.games.map(game => (
              <li>{`${game.numPlays} - ${game.name}`}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

PlaysForOwnedGames.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  games: PropTypes.arrayOf(
    PropTypes.shape({
      numPlays: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  username: PropTypes.string.isRequired,
};

PlaysForOwnedGames.defaultProps = {
  games: undefined,
};

export default PlaysForOwnedGames;
