import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { getOwnedGames, getPlays } from './data';
import PlaysForOwnedGames from './PlaysForOwnedGames';
import GamesPlayProgress from './GamesPlayProgress';

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
  const [username, setUsername] = useState('kawouin');
  const [isFetching, setIsFetching] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [ownedGames, setOwnedGames] = useState();
  const [plays, setPlays] = useState();

  const fetchData = async event => {
    event.preventDefault();
    setIsFetching(true);
    setHasError(false);

    const ownedGamesPromise = getOwnedGames(username);
    const playsPromise = getPlays(username);
    const fetchedOwnedGames = await ownedGamesPromise;
    const fetchedPlays = await playsPromise;

    if (fetchedOwnedGames && fetchedPlays) {
      setOwnedGames(fetchedOwnedGames);
      setPlays(fetchedPlays);
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
      <GamesPlayProgress
        isFetching={isFetching}
        hasError={hasError}
        plays={plays}
        username={username}
        className={classes.plays}
      />
      <PlaysForOwnedGames
        isFetching={isFetching}
        hasError={hasError}
        games={ownedGames}
        username={username}
        className={classes.owned}
      />
    </div>
  );
};

export default Bgg;
