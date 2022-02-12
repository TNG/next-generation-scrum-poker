import { StateUpdater, useEffect, useState } from 'preact/hooks';

export function useLocalStorage(
  key: string,
  initialValue: string | (() => string)
): [string, StateUpdater<string>] {
  const [value, setValue] = useState(localStorage.getItem(key) ?? initialValue);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value]);

  return [value, setValue];
}
