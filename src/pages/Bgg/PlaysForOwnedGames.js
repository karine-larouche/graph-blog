import React from 'react';
import PropTypes from 'prop-types';
import { Pie } from '@vx/shape';
import { Group } from '@vx/group';
import { red, orange, amber, lightGreen } from '@material-ui/core/colors';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { sortBy } from '../../utils/arrayUtils';

const emptyPlayGroups = () => [
  { label: 'Never played', color: red[700], games: [] },
  { label: '1 play', color: orange[800], games: [] },
  { label: '2 plays', color: amber[500], games: [] },
  { label: '3-4 plays', color: lightGreen[600], games: [] },
  { label: '5-9 plays', color: lightGreen[700], games: [] },
  { label: '10-25 plays', color: lightGreen[800], games: [] },
  { label: '25+ plays', color: lightGreen[900], games: [] },
];

const playGroupIndex = numPlays => {
  if (numPlays < 3) return numPlays;
  if (numPlays >= 3 && numPlays < 5) return 3;
  if (numPlays >= 5 && numPlays < 10) return 4;
  if (numPlays >= 10 && numPlays < 25) return 5;
  return 6;
};

const groupByPlays = games => {
  const grouped = emptyPlayGroups();
  sortBy(games, 'numPlays').forEach(game => {
    grouped[playGroupIndex(game.numPlays)].games.push(game);
  });
  return grouped;
};

const useStyles = makeStyles({
  chart: {
    display: 'flex',
    flexDirection: 'row',
    margin: 20,
  },
  legend: {
    margin: '20px 0 0 20px',
  },
  legendItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    height: 20,
    width: 20,
    borderRadius: 10,
    marginRight: 8,
  },
});

const PlaysForOwnedGames = ({ isFetching, hasError, games, username }) => {
  const classes = useStyles();

  if (isFetching) return `Fetching games for ${username}...`;
  if (hasError) return 'An error occured... sorry!';
  if (!games) return 'Enter your bgg username to view your plays.';
  if (games.length === 0)
    return 'Mark some games as owned on bgg to see this chart.';

  const playAmounts = groupByPlays(games);
  const noRecordedPlays = !playAmounts.slice(1).find(a => a.games.length);
  if (noRecordedPlays) return 'Log your plays on bgg to see this chart.';

  const [width, height] = [220, 220];
  const radius = Math.min(width, height) / 2;
  const centerX = width / 2;
  const centerY = height / 2;
  return (
    <>
      <div className={classes.chart}>
        <svg width={width} height={height}>
          <Group top={centerY} left={centerX}>
            <Pie
              data={playAmounts}
              pieValue={d => d.games.length}
              pieSortValues={() => -1}
              outerRadius={radius}
            >
              {pie =>
                pie.arcs.map((arc, i) => (
                  <g key={arc.data.label}>
                    <path d={pie.path(arc)} fill={playAmounts[i].color} />
                  </g>
                ))
              }
            </Pie>
          </Group>
        </svg>
        <div className={classes.legend}>
          {playAmounts.map(playAmount => (
            <div key={playAmount.label} className={classes.legendItem}>
              <div
                className={classes.legendColor}
                style={{ backgroundColor: playAmount.color }}
              />
              <Typography>{playAmount.label}</Typography>
            </div>
          ))}
        </div>
      </div>
      <ul>
        {groupByPlays(games).map(group => (
          <li key={group.label}>
            {group.label}
            <ul>
              {group.games.map(game => (
                <li key={game.name}>{`${game.numPlays} - ${game.name}`}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
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
