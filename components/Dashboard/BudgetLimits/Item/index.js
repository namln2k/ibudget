import React from 'react';
import { Grid, Typography } from '@mui/material';
import classNames from 'classnames';
import LinearProgress from '@mui/material/LinearProgress';
import styles from './Item.module.scss';

const colors = [
  'rgba(10, 10, 220, 0.8)',
  'rgba(10, 220, 220, 0.8)',
  'rgba(220, 10, 220, 0.8)',
  'rgba(220, 10, 10, 0.8)',
  'rgba(10, 220, 10, 0.8)',
  'rgba(220, 220, 10, 0.8)'
];

export default function Item({ title, progress, index }) {
  const color = colors[index % 6];

  return (
    <>
      <Grid className={classNames(styles.item)} flex={true} flexDirection="row">
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <Typography fontWeight={500} className={classNames(styles.title)}>
            {title}
          </Typography>
          <Typography fontWeight={500}>{progress}%</Typography>
        </Grid>
        <Grid className={classNames(styles.progressContainer)}>
          <LinearProgress
            className={classNames(styles.progressBar)}
            variant="determinate"
            value={progress}
            sx={{
              backgroundColor: '#DFDFDF',
              '& .MuiLinearProgress-bar': {
                backgroundColor: color
              }
            }}
          ></LinearProgress>
        </Grid>
      </Grid>
    </>
  );
}
