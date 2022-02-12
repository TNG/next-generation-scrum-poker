import { createContext } from 'preact';
import { useCallback, useLayoutEffect } from 'preact/hooks';
import { JSXInternal } from 'preact/src/jsx';
import { useLocalStorage } from './useLocalStorage';

interface ColorModeContext {
  isDark: boolean;
  toggleColorMode: () => void;
}

export const ColorMode = createContext<ColorModeContext>({
  isDark: false,
  toggleColorMode: () => {},
});

export const ColorModeProvider = ({ children }: { children: JSXInternal.Element }) => {
  const [theme, setTheme] = useLocalStorage('theme', () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  useLayoutEffect(() => {
    document.body.setAttribute('data-color-mode', theme);
  }, [theme]);

  const toggleColorMode = useCallback(
    () => setTheme((theme) => (theme === 'dark' ? 'light' : 'dark')),
    []
  );

  return (
    <ColorMode.Provider value={{ isDark: theme === 'dark', toggleColorMode }}>
      {children}
    </ColorMode.Provider>
  );
};
