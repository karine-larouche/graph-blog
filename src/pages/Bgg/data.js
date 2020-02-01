import { range } from '../../utils/arrayUtils';
import fetchWithRetry from '../../utils/fetchWithRetry';

const ownedGamesUrl = username =>
  `https://www.boardgamegeek.com/xmlapi2/collection?username=${username}&own=1&excludesubtype=boardgameexpansion`;

const playsUrl = (username, page = 1) =>
  `https://www.boardgamegeek.com/xmlapi2/plays?username=${username}&page=${page}`;

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

const parsePlays = data => {
  const document = new DOMParser().parseFromString(data, 'text/xml');
  return [...document.getElementsByTagName('play')]
    .filter(isNotExpansion)
    .map(p => ({
      date: p.getAttribute('date'),
      quantity: parseInt(p.getAttribute('quantity')),
      name: p.getElementsByTagName('item')[0].getAttribute('name'),
    }));
};

export const getOwnedGames = async username => {
  const result = await fetchWithRetry(ownedGamesUrl(username));
  return result && result.status === 200
    ? parseOwnedGames(result.data)
    : undefined;
};

const totalPlayPages = data => {
  const document = new DOMParser().parseFromString(data, 'text/xml');
  return Math.ceil(
    document.getElementsByTagName('plays')[0].getAttribute('total') / 100,
  );
};

export const getPlays = async username => {
  const result = await fetchWithRetry(playsUrl(username));
  if (!result || result.status !== 200) return undefined;

  const plays = parsePlays(result.data);

  const playPages = await Promise.all(
    range(2, totalPlayPages(result.data)).map(async page => {
      const pageResult = await fetchWithRetry(playsUrl(username, page));
      return pageResult && pageResult.status === 200
        ? parsePlays(pageResult.data)
        : undefined;
    }),
  );
  if (playPages.find(p => p === undefined)) return undefined;

  return plays.concat(...playPages);
};
