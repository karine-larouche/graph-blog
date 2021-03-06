import fetchWithRetry from '../../../utils/fetchWithRetry';

const playedAndRatedGamesUrl = username =>
  `https://www.boardgamegeek.com/xmlapi2/collection?username=${username}&played=1&excludesubtype=boardgameexpansion&stats=1&rated=1`;

const parseGames = data => {
  const document = new DOMParser().parseFromString(data, 'text/xml');
  return [...document.getElementsByTagName('item')].map(i => ({
    name:
      i.getElementsByTagName('originalname').length > 0
        ? i.getElementsByTagName('originalname')[0].childNodes[0].nodeValue
        : i.getElementsByTagName('name')[0].childNodes[0].nodeValue,
    rating: parseFloat(
      i
        .getElementsByTagName('stats')[0]
        .getElementsByTagName('rating')[0]
        .getAttribute('value'),
    ),
  }));
};

export default async (username, errorState) => {
  const result = await fetchWithRetry(
    playedAndRatedGamesUrl(username),
    errorState,
  );
  return result && parseGames(result.data);
};
