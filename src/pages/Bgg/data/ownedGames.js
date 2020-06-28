import fetchWithRetry from '../../../utils/fetchWithRetry';

const ownedGamesUrl = username =>
  `https://www.boardgamegeek.com/xmlapi2/collection?username=${username}&own=1&excludesubtype=boardgameexpansion`;

const parseOwnedGames = data => {
  const document = new DOMParser().parseFromString(data, 'text/xml');
  return [...document.getElementsByTagName('item')].map(i => ({
    name: i.getElementsByTagName('name')[0].childNodes[0].nodeValue,
    numPlays: parseInt(
      i.getElementsByTagName('numplays')[0].childNodes[0].nodeValue,
    ),
  }));
};

export default async (username, errorState) => {
  const result = await fetchWithRetry(ownedGamesUrl(username), errorState);
  return result && parseOwnedGames(result.data);
};
