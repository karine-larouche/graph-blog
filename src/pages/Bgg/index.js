import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import getOwnedGames from './data/ownedGames';
import getRatings from './data/ratings';
import getPlays from './data/plays';
import PlaysForOwnedGames from './PlaysForOwnedGames';
import GamesPlayProgress from './GamesPlayProgress';
import { analytics } from '../../firebase';

const useStyles = makeStyles({
  root: {
    padding: 20,
  },
  plays: {
    margin: '20px 0',
  },
  owned: {
    height: 220,
  },
});

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
        <Route path="/bgg-play-progress">
          <GamesPlayProgress
            isFetching={isFetching}
            hasError={hasError}
            plays={plays}
            ratings={ratings}
            username={username}
            className={classes.plays}
          />
        </Route>
      </Switch>
    </div>
  );
};

export default Bgg;
