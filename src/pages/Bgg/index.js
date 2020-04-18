import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import getOwnedGames from './data/ownedGames';
import getRatings from './data/ratings';
import getPlays from './data/plays';
import PlaysForOwnedGames from './PlaysForOwnedGames';
import GamesPlayProgress from './GamesPlayProgress';
import GroupedPlayProgress from './GroupedPlayProgress';
import { analytics } from '../../firebase';

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
    margin: theme.spacing(1, 0),
  },
  plays: {
    flex: 1,
    overflow: 'auto',
  },
  owned: {
    flex: 1,
  },
}));

const Bgg = () => {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [ownedGames, setOwnedGames] = useState();
  const [ratings, setRatings] = useState();
  const [plays, setPlays] = useState();

  const fetchData = async event => {
    event.preventDefault();
    setIsFetching(true);
    setHasError(false);

    analytics.logEvent('bgg_username_submit', { value: username });

    const ownedGamesPromise = getOwnedGames(username);
    const playsPromise = getPlays(username);
    const ratingsPromise = getRatings(username);
    const fetchedOwnedGames = await ownedGamesPromise;
    const fetchedPlays = await playsPromise;
    const fetchedRatings = await ratingsPromise;

    if (fetchedOwnedGames && fetchedPlays && fetchedRatings) {
      setOwnedGames(fetchedOwnedGames);
      setPlays(fetchedPlays);
      setRatings(fetchedRatings);
    } else {
      setHasError(true);
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
            hasError={hasError}
            games={ownedGames}
            username={username}
            className={classes.owned}
          />
        </Route>
        <Route path="/bgg-play-progress-by-game">
          <GamesPlayProgress
            key={plays}
            isFetching={isFetching}
            hasError={hasError}
            plays={plays}
            ratings={ratings}
            username={username}
            className={classes.plays}
          />
        </Route>
        <Route path="/bgg-play-progress-grouped">
          <GroupedPlayProgress
            key={plays}
            isFetching={isFetching}
            hasError={hasError}
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
