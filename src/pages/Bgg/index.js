import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { track } from '../../firebase';
import getData from './data';
import PlaysForOwnedGames from './PlaysForOwnedGames';
import GamesPlayProgress from './GamesPlayProgress';
import GroupedPlayProgress from './GroupedPlayProgress';
import HIndex from './HIndex';

const useErrorState = () => {
  const [errorState, setErrorState] = useState({
    hasError: false,
    error: null,
  });

  const setError = error =>
    setErrorState({
      hasError: true,
      error,
    });

  const resetErrorState = () =>
    setErrorState({
      hasError: false,
      error: null,
    });

  return [errorState, setError, resetErrorState];
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    boxSizing: 'border-box',
    overflow: 'auto',
  },
  input: {
    margin: theme.spacing(1, 0, 3),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1, 0),
    },
  },
  plays: {
    flex: 1,
    overflow: 'auto',
  },
}));

const Bgg = () => {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [errorState, setError, resetErrorState] = useErrorState();
  const [ownedGames, setOwnedGames] = useState();
  const [ratings, setRatings] = useState();
  const [plays, setPlays] = useState();

  const fetchData = async event => {
    event.preventDefault();
    track('bgg_username_submit', username);

    if (!username) return;

    setIsFetching(true);
    resetErrorState();

    const data = await getData(username);

    if (data.hasError) {
      setError(data.error);
    } else {
      setOwnedGames(data.ownedGames);
      setPlays(data.plays);
      setRatings(data.ratings);
    }

    setIsFetching(false);
  };

  return (
    <div className={classes.root}>
      <form onSubmit={fetchData}>
        <TextField
          label="bgg username"
          variant="outlined"
          value={username}
          onChange={event => setUsername(event.target.value)}
          className={classes.input}
        />
      </form>
      <Switch>
        <Route path="/bgg-owned-games">
          <PlaysForOwnedGames
            isFetching={isFetching}
            errorState={errorState}
            games={ownedGames}
            username={username}
          />
        </Route>
        <Route path="/bgg-play-progress-grouped">
          <GroupedPlayProgress
            isFetching={isFetching}
            errorState={errorState}
            plays={plays}
            username={username}
            className={classes.plays}
          />
        </Route>
        <Route path="/bgg-play-progress-by-game">
          <GamesPlayProgress
            key={plays}
            isFetching={isFetching}
            errorState={errorState}
            plays={plays}
            ratings={ratings}
            username={username}
            className={classes.plays}
          />
        </Route>
        <Route path="/bgg-h-index">
          <HIndex
            isFetching={isFetching}
            errorState={errorState}
            plays={plays}
            username={username}
            className={classes.plays}
          />
        </Route>
      </Switch>
    </div>
  );
};

export default Bgg;
