import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { red, orange, amber, lightGreen } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { sortBy } from '../../../utils/arrayUtils';
import BggInstructions from '../../../components/BggInstruction';
import Legend from '../../../components/Legend';
import Pie from './Pie';
import List from './List';

const emptyPlayGroups = () => [
  { label: 'Never played', color: red[700], showAmount: false, games: [] },
  { label: '1 play', color: orange[800], showAmount: false, games: [] },
  { label: '2 plays', color: amber[500], showAmount: false, games: [] },
  { label: '3-4 plays', color: lightGreen[600], showAmount: true, games: [] },
  { label: '5-9 plays', color: lightGreen[700], showAmount: true, games: [] },
  { label: '10-25 plays', color: lightGreen[800], showAmount: true, games: [] },
  { label: '25+ plays', color: lightGreen[900], showAmount: true, games: [] },
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

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
  },
  pieAndLegend: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: 10,
    justifyContent: 'center',
  },
  pie: {
    flexShrink: 0,
  },
  legend: {
    margin: '10px 20px 0 20px',
  },
  list: {
    marginTop: 10,
    minWidth: 200,
    maxWidth: 320,
    boxSizing: 'border-box',
    [theme.breakpoints.up('sm')]: {
      flex: 1,
      maxHeight: 320,
    },
  },
}));

const PlaysForOwnedGames = ({
  isFetching,
  hasError,
  games,
  username,
  className,
}) => {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = useState();

  if (isFetching)
    return <Typography>{`Fetching games for ${username}...`}</Typography>;
  if (hasError) return <Typography>An error occured... sorry!</Typography>;
  if (!games) return <BggInstructions />;
  if (games.length === 0)
    return (
      <Typography>
        Mark some games as owned on bgg to see this chart.
      </Typography>
    );

  const playAmounts = groupByPlays(games);
  const noRecordedPlays = !playAmounts.slice(1).find(a => a.games.length);
  if (noRecordedPlays) return 'Log your plays on bgg to see this chart.';

  const selected = playAmounts[selectedIndex];

  return (
    <div className={`${className} ${classes.root}`}>
      <div className={classes.pieAndLegend}>
        <Pie
          playAmounts={playAmounts}
          selectedIndex={selectedIndex}
          onSectionSelection={setSelectedIndex}
          className={classes.pie}
        />
        <Legend data={playAmounts} className={classes.legend} />
      </div>
      <List selected={selected} className={classes.list} />
    </div>
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
