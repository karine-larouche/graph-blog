import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { getOwnedGames, getPlayedGames } from './data';
import PlaysForOwnedGames from './PlaysForOwnedGames';

const useStyles = makeStyles({
  root: {
    padding: 20,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  plays: {
    overflowY: 'hidden',
  },
});

const Bgg = () => {
  const classes = useStyles();
  const [username, setUsername] = useState('kawouin');
  const [isFetching, setIsFetching] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [ownedGames, setOwnedGames] = useState();
  const [playedGames, setPlayedGames] = useState();

  const fetchData = async event => {
    event.preventDefault();
    setIsFetching(true);
    setHasError(false);

    const ownedGamesPromise = getOwnedGames(username);
    const playedGamesPromise = getPlayedGames(username);
    const fetchedOwnedGames = await ownedGamesPromise;
    const fetchedPlayedGames = await playedGamesPromise;

    if (fetchedOwnedGames && fetchedPlayedGames) {
      setOwnedGames(fetchedOwnedGames);
      setPlayedGames(fetchedPlayedGames);
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
      <PlaysForOwnedGames
        isFetching={isFetching}
        hasError={hasError}
        games={ownedGames}
        username={username}
        className={classes.plays}
      />
    </div>
  );
};

export default Bgg;
