import { Box, Grid, Typography } from '@mui/material';
import axios from 'axios';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useLoadingContext } from '../../../contexts/loading';
import styles from './RandomQuote.module.scss';

export default function RandomQuote() {
  const [quote, setQuote] = useState({});

  useEffect(() => {
    const getRandomQuote = async () => {
      const quoteResponse = await axios.get('https://api.quotable.io/random');

      if (quoteResponse?.data) {
        setQuote(quoteResponse.data);
      }
    };

    getRandomQuote();
  }, []);

  return (
    <>
      <Grid className={classNames(styles.section)}>
        <Typography className={classNames(styles.title)}>
          Random quote
        </Typography>
        {quote && (
          <>
            <Grid className={classNames(styles.content)}>
              <blockquote className={classNames(styles.blockQuote)}>
                {quote?.content}
                <span>--- {quote?.author} ---</span>
              </blockquote>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
}
