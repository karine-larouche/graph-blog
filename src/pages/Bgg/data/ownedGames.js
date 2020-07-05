import fetchWithRetry from '../../../utils/fetchWithRetry';
import { sortBy } from '../../../utils/arrayUtils';

const excludedObjectIds = [
  '33456', // Miscellaneous Card Game Accessory
  '5985', // Miscellaneous Game Accessory
  '22427', // Miscellaneous Game Book
  '96628', // Miscellaneous Game Compilation
  '18785', // Miscellaneous Game Magazine
  '22104', // Miscellaneous Game Merchandise
  '31693', // Miscellaneous Miniatures Game Accessory
  '23953', // Outside the Scope of BGG
];

const ownedGamesUrl = username =>
  `https://www.boardgamegeek.com/xmlapi2/collection?username=${username}&own=1&excludesubtype=boardgameexpansion`;

const sortAndRemoveDuplicates = games =>
  sortBy(games, 'numPlays').filter(
    (game, i, sortedGames) => i === 0 || game.name !== sortedGames[i - 1].name,
  );

const parseOwnedGames = data => {
  const document = new DOMParser().parseFromString(data, 'text/xml');
  return [...document.getElementsByTagName('item')]
    .filter(i => !excludedObjectIds.includes(i.getAttribute('objectid')))
    .map(i => ({
      name:
        i.getElementsByTagName('originalname').length > 0
          ? i.getElementsByTagName('originalname')[0].childNodes[0].nodeValue
          : i.getElementsByTagName('name')[0].childNodes[0].nodeValue,
      numPlays: parseInt(
        i.getElementsByTagName('numplays')[0].childNodes[0].nodeValue,
      ),
    }));
};

export default async (username, errorState) => {
  const result = await fetchWithRetry(ownedGamesUrl(username), errorState);
  return result && sortAndRemoveDuplicates(parseOwnedGames(result.data));
};
