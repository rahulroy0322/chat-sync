import {
  createContext,
  type FC,
  use,
  useCallback,
  useEffect,
  useState,
} from 'react';

type ThemeModeType = 'dark' | 'light' | 'system';

type ModeProviderPropsType = {
  children: React.ReactNode;
  defaultMode?: ThemeModeType;
  storageKey?: string;
};

type ModeProviderStateType = {
  mode: ThemeModeType;
  setMode: (mode: ThemeModeType) => void;
};

const ModeProviderContext = createContext<ModeProviderStateType | null>(null);

const ModeProvider: FC<ModeProviderPropsType> = ({
  children,
  defaultMode = 'system',
  storageKey = 'vite-ui-mode',
}) => {
  const [mode, _setMode] = useState<ThemeModeType>(
    () => (localStorage.getItem(storageKey) as ThemeModeType) || defaultMode
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (mode === 'system') {
      const systemMode = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemMode);
      return;
    }

    root.classList.add(mode);
  }, [mode]);

  const setMode = useCallback(
    (mode: ThemeModeType) => {
      localStorage.setItem(storageKey, mode);
      _setMode(mode);
    },
    [storageKey]
  );

  return (
    <ModeProviderContext.Provider
      value={{
        mode,
        setMode,
      }}
    >
      {children}
    </ModeProviderContext.Provider>
  );
};

const useMode = () => {
  const context = use(ModeProviderContext);

  if (!context) throw new Error(`"useMode" must be used within a ModeProvider`);

  return context;
};

export type { ThemeModeType };

export { ModeProvider, useMode };
