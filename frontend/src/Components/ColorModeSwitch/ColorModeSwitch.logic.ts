import { useLayoutEffect, useState } from 'preact/hooks';

enum Mode {
  DARK = 'dark',
  LIGHT = 'light',
}
const storageKey = 'color-mode';
const attributeKey = 'data-color-mode';

function getInitialColorMode(): boolean {
  const storedValue = localStorage.getItem(storageKey);

  return storedValue === undefined
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : storedValue === Mode.DARK;
}

export function useColorMode(): { isDark: boolean; toggleColorMode: () => void } {
  const [isDark, setIsDark] = useState<boolean>(getInitialColorMode);

  useLayoutEffect(() => {
    const mode = isDark ? Mode.DARK : Mode.LIGHT;
    document.body.setAttribute(attributeKey, mode);
    localStorage.setItem(storageKey, mode);
  }, [isDark]);

  return { isDark, toggleColorMode: () => setIsDark((isDark) => !isDark) };
}
