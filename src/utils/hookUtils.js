import { useState } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useTogglableBooleanState = (defaultValue = false) => {
  const [value, setValue] = useState(defaultValue);
  const toggleValue = () => setValue(!value);

  return [value, toggleValue];
};
