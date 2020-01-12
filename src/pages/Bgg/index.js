import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { getOwnedGames } from './data';
import PlaysForOwnedGames from './PlaysForOwnedGames';

const Bgg = () => {
  const [username, setUsername] = useState('kawouin');
  const [isFetching, setIsFetching] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [playedGames, setPlayedGames] = useState();

  const fetchOwnedGames = async event => {
    event.preventDefault();
    setIsFetching(true);
    setHasError(false);

    const games = await getOwnedGames(username);

    if (games) setPlayedGames(games);
    else setHasError(true);

    setIsFetching(false);
  };

  return (
    <>
      <form onSubmit={fetchOwnedGames}>
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
        games={playedGames}
        username={username}
      />
    </>
  );
};

export default Bgg;
