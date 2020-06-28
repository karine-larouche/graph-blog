/* eslint-disable no-await-in-loop */
import axios from 'axios';

export default async (url, errorState) => {
  let result;
  for (let i = 0; i < 3; i += 1) {
    try {
      if (errorState.hasError) return undefined;
      result = await axios(url);
    } catch (e) {
      // ignore
    }
    if (result && result.status === 200) {
      return result;
    }
    if (i < 3) {
      if (errorState.hasError) return undefined;
      await new Promise(r => setTimeout(r, 1000 * 2 ** i));
    }
  }
  // eslint-disable-next-line no-param-reassign
  errorState.hasError = true;
  return undefined;
};
