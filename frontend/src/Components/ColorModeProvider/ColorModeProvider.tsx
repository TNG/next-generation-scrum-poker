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
  const [isDark, setIsDark] = useState<boolean>(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useLayoutEffect(() => {
    document.body.setAttribute('data-color-mode', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleColorMode = useCallback(() => setIsDark((theme) => !theme), []);

  return <ColorMode.Provider value={{ isDark, toggleColorMode }}>{children}</ColorMode.Provider>;
};
