import { range } from '../../../utils/arrayUtils';
import fetchWithRetry from '../../../utils/fetchWithRetry';

const playsUrl = (username, page = 1) =>
  `https://www.boardgamegeek.com/xmlapi2/plays?username=${username}&page=${page}`;

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

const totalPlayPages = data => {
  const document = new DOMParser().parseFromString(data, 'text/xml');
  return Math.ceil(
    document.getElementsByTagName('plays')[0].getAttribute('total') / 100,
  );
};

export default async username => {
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
