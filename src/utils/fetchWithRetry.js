/* eslint-disable no-await-in-loop */
import axios from 'axios';

export default async url => {
  let result;
  for (let i = 0; i < 3; i += 1) {
    try {
      result = await axios(url);
    } catch (e) {
      // ignore
    }
    if (result && result.status === 200) {
      console.log(`success after retry ${i}`);
      break;
    } else if (i < 3) {
      await new Promise(r => setTimeout(r, 1000 * 2 ** i));
    } else {
      console.log(`Failure after retry ${i}`);
    }
  }
  return result;
};
