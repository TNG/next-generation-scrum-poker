import { createContext } from 'preact';
import { useCallback, useLayoutEffect, useState } from 'preact/hooks';
import { JSXInternal } from 'preact/src/jsx';

interface ColorModeContext {
  isDark: boolean;
  toggleColorMode: () => void;
}

export const ColorMode = createContext<ColorModeContext>({
  isDark: false,
  toggleColorMode: () => {},
});

export const ColorModeProvider = ({ children }: { children: JSXInternal.Element }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
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
