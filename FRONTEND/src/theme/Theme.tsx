import { createTheme } from '@mui/material/styles';
const commonSettings = {
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
};
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#009688' },   // teal
    secondary: { main: '#ff9800' }, // orange
  },
  ...commonSettings,
});
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#80cbc4' },   // lighter teal
    secondary: { main: '#ffb74d' }, // lighter orange
  },
  ...commonSettings,
});
