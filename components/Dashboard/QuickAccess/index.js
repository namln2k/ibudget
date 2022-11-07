import React from 'react';
import classNames from 'classnames';
import { Grid, Typography, Box } from '@mui/material';
import styles from './QuickAccess.module.scss';

export default function QuickAccess() {
  return (
    <>
      <Grid className={classNames(styles.section, styles.quickAccess)}>
        <Typography className={classNames(styles.title)}>
          Quick access
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            maxWidth: 500,
            borderRadius: 1
          }}
        >
          <Typography className={classNames(styles.item, styles.button)}>
            Add expense
          </Typography>
          <Typography className={classNames(styles.item, styles.button)}>
            Add income
          </Typography>
          <Typography className={classNames(styles.item, styles.button)}>
            Team spending
          </Typography>
          <Typography className={classNames(styles.item, styles.button)}>
            List debtors
          </Typography>
          <Typography className={classNames(styles.item, styles.button)}>
            Report a bug
          </Typography>
        </Box>
      </Grid>
    </>
  );
}
