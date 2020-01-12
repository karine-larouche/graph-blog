import fetchWithRetry from '../../utils/fetchWithRetry';

const ownedGamesUrl = username =>
  `https://www.boardgamegeek.com/xmlapi2/collection?username=${username}&own=1&excludesubtype=boardgameexpansion`;

const parseGames = data => {
  const document = new DOMParser().parseFromString(data, 'text/xml');
  return [...document.getElementsByTagName('item')].map(i => ({
    name: i.getElementsByTagName('name')[0].childNodes[0].nodeValue,
    numPlays: parseInt(
      i.getElementsByTagName('numplays')[0].childNodes[0].nodeValue,
    ),
  }));
};

// eslint-disable-next-line import/prefer-default-export
export const getOwnedGames = async username => {
  const result = await fetchWithRetry(ownedGamesUrl(username));
  return result && result.status === 200 ? parseGames(result.data) : undefined;
};
