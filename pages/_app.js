import '../styles/globals.scss';
import { ThemeProvider } from '@mui/material';
import { theme } from '../config/theme';
import createEmotionCache from '../config/createEmotionCache';
import { CacheProvider } from '@emotion/react';
import { UserProvider } from '../contexts/user';

const clientSideEmotionCache = createEmotionCache();

function MyApp({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps
}) {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
