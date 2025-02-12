import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { red, orange, amber, lightGreen, grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import BggInstructions from '../../../components/BggInstruction';
import BggErrorState from '../../../components/BggErrorState';
import BggSkeletonOverlay from '../../../components/BggSkeletonOverlay';
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

const playAmountSkeleton = [
  { label: 'Never played', color: grey[500], numGames: 1 },
  { label: '1 play', color: grey[400], numGames: 2 },
  { label: '2 plays', color: grey[200], numGames: 3 },
  { label: '3-4 plays', color: grey[300], numGames: 3 },
  { label: '5-9 plays', color: grey[400], numGames: 4 },
  { label: '10-25 plays', color: grey[500], numGames: 5 },
  { label: '25+ plays', color: grey[600], numGames: 4 },
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
  games.forEach(game => {
    grouped[playGroupIndex(game.numPlays)].games.push(game);
  });
  return grouped;
};

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
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
  errorState,
  games,
  username,
  className,
}) => {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = useState();

  if (!isFetching) {
    if (errorState.hasError && errorState.error === 'username')
      return <Typography>Invalid username</Typography>;
    if (errorState.hasError) return <BggErrorState />;
    if (!games) return <BggInstructions />;
    if (games.length === 0)
      return (
        <Typography>
          Mark some games as owned on bgg to see this chart.
        </Typography>
      );
  }

  const playAmounts = isFetching ? playAmountSkeleton : groupByPlays(games);
  const noRecordedPlays =
    !isFetching && !playAmounts.slice(1).find(a => a.games.length);
  if (noRecordedPlays)
    return <Typography>Log your plays on bgg to see this chart.</Typography>;

  const selected = playAmounts[selectedIndex];

  return (
    <div className={`${className} ${classes.root}`}>
      <div className={classes.pieAndLegend}>
        <Pie
          isSkeleton={isFetching}
          playAmounts={playAmounts}
          selectedIndex={selectedIndex}
          onSectionSelection={setSelectedIndex}
          className={classes.pie}
        />
        <Legend
          data={playAmounts}
          isSkeleton={isFetching}
          selectedIndex={selectedIndex}
          onSectionSelection={setSelectedIndex}
          className={classes.legend}
        />
      </div>
      <List
        isSkeleton={isFetching}
        selected={selected}
        className={classes.list}
      />
      {isFetching && (
        <BggSkeletonOverlay text={`Fetching games for ${username}...`} />
      )}
    </div>
  );
};

PlaysForOwnedGames.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  errorState: PropTypes.shape({
    hasError: PropTypes.bool.isRequired,
    error: PropTypes.string,
  }).isRequired,
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
