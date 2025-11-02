import {
  createContext,
  type FC,
  use,
  useCallback,
  useEffect,
  useState,
} from 'react';

const THEMES = ['default', 'blue', 'green', 'rose', 'violet'] as const;

type ThemeType = (typeof THEMES)[number];

type ThemeProviderStateType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
};

const ThemeProviderContext = createContext<ThemeProviderStateType | null>(null);

type ThemeProviderPropsType = {
  children: React.ReactNode;
  defaultTheme?: ThemeType;
  storageKey?: string;
};

const ThemeProvider: FC<ThemeProviderPropsType> = ({
  children,
  defaultTheme = 'default',
  storageKey = 'vite-ui-theme',
}) => {
  const [theme, _setTheme] = useState<ThemeType>(
    () => (localStorage.getItem(storageKey) as ThemeType) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove(...THEMES);

    if (theme === 'default') {
      return;
    }

    if (!THEMES.includes(theme)) {
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const setTheme = useCallback(
    (theme: ThemeType) => {
      localStorage.setItem(storageKey, theme);
      _setTheme(theme);
    },
    [storageKey]
  );

  return (
    <ThemeProviderContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
};

const useTheme = () => {
  const context = use(ThemeProviderContext);

  if (!context)
    throw new Error(`"useTheme" must be used within a ThemeProvider`);

  return context;
};

export type { ThemeType };

export { ThemeProvider, useTheme };
