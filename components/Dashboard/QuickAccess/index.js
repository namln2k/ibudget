import BugReportIcon from '@mui/icons-material/BugReport';
import GitHubIcon from '@mui/icons-material/GitHub';
import PaidIcon from '@mui/icons-material/Paid';
import { Box, Grid, Typography } from '@mui/material';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import React from 'react';
import styles from './QuickAccess.module.scss';

export default function QuickAccess() {
  const router = useRouter();

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
          <Typography
            className={classNames(styles.item, styles.button)}
            onClick={() => {
              router.push(
                {
                  pathname: '/transactions',
                  query: {
                    action: 'add-expense'
                  }
                },
                '/transactions'
              );
            }}
          >
            Add expense
            <PaidIcon sx={{ marginLeft: '12px' }}></PaidIcon>
          </Typography>
          <Typography
            className={classNames(styles.item, styles.button)}
            onClick={() => {
              router.push(
                {
                  pathname: '/transactions',
                  query: {
                    action: 'add-income'
                  }
                },
                '/transactions'
              );
            }}
          >
            Add income
            <PaidIcon sx={{ marginLeft: '12px' }}></PaidIcon>
          </Typography>
          <Typography
            className={classNames(styles.item, styles.button)}
            onClick={(e) => {
              e.preventDefault();
              window.open('mailto:namln2aug2k@gmail.com', '_blank');
            }}
          >
            Email me
            <BugReportIcon sx={{ marginLeft: '12px' }}></BugReportIcon>
          </Typography>
          <Typography
            className={classNames(styles.item, styles.button)}
            onClick={(e) => {
              e.preventDefault();
              window.open('https://github.com/namln2k', '_blank');
            }}
          >
            Support me on Github
            <GitHubIcon sx={{ marginLeft: '12px' }}></GitHubIcon>
          </Typography>
        </Box>
      </Grid>
    </>
  );
}
