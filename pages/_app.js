import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import { UserProvider } from '../contexts/user';
import { LoadingProvider } from '../contexts/loading';
import '../styles/globals.scss';
import lightTheme from '../styles/theme/lightTheme';
import createEmotionCache from '../utils/createEmotionCache';

const clientSideEmotionCache = createEmotionCache();

const MyApp = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <UserProvider>
          <LoadingProvider>
            <Component {...pageProps} />
          </LoadingProvider>
        </UserProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;
