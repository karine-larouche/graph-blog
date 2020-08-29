/* eslint-disable no-await-in-loop */
import axios from 'axios';

const waitTimes = [0.5, 3];

export default async (url, errorState) => {
  let result;
  for (let i = 0; i <= waitTimes.length; i += 1) {
    try {
      if (errorState.hasError) return undefined;
      result = await axios(url);
    } catch (e) {
      // ignore
    }
    if (result && result.status === 200) {
      return result;
    }
    if (i < waitTimes.length) {
      if (errorState.hasError) return undefined;
      await new Promise(r => setTimeout(r, 1000 * waitTimes[i]));
    }
  }
  // eslint-disable-next-line no-param-reassign
  errorState.hasError = true;
  return undefined;
};
