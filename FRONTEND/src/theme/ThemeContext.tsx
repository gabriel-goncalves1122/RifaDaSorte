import React, { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './Theme';

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};
const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});
export const useThemeMode = () => useContext(ThemeContext);
export const ThemeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('preferredTheme');
    return stored === 'dark';
  });
const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('preferredTheme', next ? 'dark' : 'light');
      return next;
    });
  };

  const theme = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

