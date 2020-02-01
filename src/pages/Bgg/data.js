import fetchWithRetry from '../../utils/fetchWithRetry';

const ownedGamesUrl = username =>
  `https://www.boardgamegeek.com/xmlapi2/collection?username=${username}&own=1&excludesubtype=boardgameexpansion`;

const playsUrl = username =>
  `https://www.boardgamegeek.com/xmlapi2/plays?username=${username}`;

const parseOwnedGames = data => {
  const document = new DOMParser().parseFromString(data, 'text/xml');
  return [...document.getElementsByTagName('item')].map(i => ({
    name: i.getElementsByTagName('name')[0].childNodes[0].nodeValue,
    numPlays: parseInt(
      i.getElementsByTagName('numplays')[0].childNodes[0].nodeValue,
    ),
  }));
};

const isNotExpansion = play =>
  ![...play.getElementsByTagName('subtype')].find(
    s => s.getAttribute('value') === 'boardgameexpansion',
  );

const parsePlays = async data => {
  const document = new DOMParser().parseFromString(data, 'text/xml');
  return [...document.getElementsByTagName('play')]
    .filter(isNotExpansion)
    .map(p => ({
      date: p.getAttribute('date'),
      quantity: p.getAttribute('quantity'),
      name: p.getElementsByTagName('item')[0].getAttribute('name'),
    }));
};

export const getOwnedGames = async username => {
  const result = await fetchWithRetry(ownedGamesUrl(username));
  return result && result.status === 200
    ? parseOwnedGames(result.data)
    : undefined;
};

export const getPlayedGames = async username => {
  const result = await fetchWithRetry(playsUrl(username));
  return result && result.status === 200 ? parsePlays(result.data) : undefined;
};
