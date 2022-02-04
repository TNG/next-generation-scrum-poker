import { createContext } from 'preact';
import { useCallback, useLayoutEffect, useState } from 'preact/hooks';
import { JSXInternal } from 'preact/src/jsx';

interface ColorModeContext {
  isDark: boolean;
  toggleColorMode: () => void;
}

enum Mode {
  DARK = 'dark',
  LIGHT = 'light',
}
const storageKey = 'color-mode';
const attributeKey = 'data-color-mode';

export const ColorMode = createContext<ColorModeContext>({
  isDark: false,
  toggleColorMode: () => {},
});

export const ColorModeProvider = ({ children }: { children: JSXInternal.Element }) => {
  const [isDark, setIsDark] = useState<boolean>(getInitialColorMode);

  useLayoutEffect(() => {
    const mode = isDark ? Mode.DARK : Mode.LIGHT;
    document.body.setAttribute(attributeKey, mode);
    localStorage.setItem(storageKey, mode);
  }, [isDark]);

  const toggleColorMode = useCallback(() => setIsDark((isDark) => !isDark), [isDark]);

  return <ColorMode.Provider value={{ isDark, toggleColorMode }}>{children}</ColorMode.Provider>;
};

function getInitialColorMode(): boolean {
  const storedValue = localStorage.getItem(storageKey);

  return storedValue === undefined
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : storedValue === Mode.DARK;
}
