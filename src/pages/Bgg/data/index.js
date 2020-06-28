import getOwnedGames from './ownedGames';
import getPlays from './plays';
import getRatings from './ratings';

export default async username => {
  const sharedErrorState = { hasError: false };

  const ownedGamesPromise = getOwnedGames(username, sharedErrorState);
  const playsPromise = getPlays(username, sharedErrorState);
  const ratingsPromise = getRatings(username, sharedErrorState);
  const ownedGames = await ownedGamesPromise;
  const plays = await playsPromise;
  const ratings = await ratingsPromise;

  if (sharedErrorState.hasError) {
    return {
      hasError: true,
      error: sharedErrorState.error,
    };
  }

  return {
    hasError: false,
    ownedGames,
    plays,
    ratings,
  };
};
