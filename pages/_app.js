import '../styles/globals.scss';
import { ThemeProvider } from '@mui/material';
import { theme } from '../config/theme';
import createEmotionCache from '../config/createEmotionCache';
import { CacheProvider } from '@emotion/react';

const clientSideEmotionCache = createEmotionCache();

function MyApp({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps
}) {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
