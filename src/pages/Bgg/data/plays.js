import { range } from '../../../utils/arrayUtils';
import fetchWithRetry from '../../../utils/fetchWithRetry';

const playsUrl = (username, page = 1) =>
  `https://www.boardgamegeek.com/xmlapi2/plays?username=${username}&page=${page}`;

const isNotExpansion = play =>
  ![...play.getElementsByTagName('subtype')].find(
    s => s.getAttribute('value') === 'boardgameexpansion',
  );

const isQuantityPositive = play =>
  [parseInt(play.getAttribute('quantity'))] > 0;

const parsePlays = data => {
  const document = new DOMParser().parseFromString(data, 'text/xml');
  return [...document.getElementsByTagName('play')]
    .filter(isNotExpansion)
    .filter(isQuantityPositive)
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

const usernameIsInvalid = data => data.includes('Invalid object or user');

export default async (username, errorState) => {
  const result = await fetchWithRetry(playsUrl(username), errorState);
  if (!result) return undefined;
  if (usernameIsInvalid(result.data)) {
    // eslint-disable-next-line no-param-reassign
    errorState.hasError = true;
    // eslint-disable-next-line no-param-reassign
    errorState.error = 'username';
    return undefined;
  }

  const plays = parsePlays(result.data);

  const playPages = await Promise.all(
    range(2, totalPlayPages(result.data)).map(async page => {
      const pageResult = await fetchWithRetry(
        playsUrl(username, page),
        errorState,
      );
      return pageResult && parsePlays(pageResult.data);
    }),
  );

  return plays.concat(...playPages);
};
