import BugReportIcon from '@mui/icons-material/BugReport';
import GitHubIcon from '@mui/icons-material/GitHub';
import PaidIcon from '@mui/icons-material/Paid';
import { Box, Grid, Typography } from '@mui/material';
import classNames from 'classnames';
import React from 'react';
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
            <PaidIcon sx={{ marginLeft: '12px' }}></PaidIcon>
          </Typography>
          <Typography className={classNames(styles.item, styles.button)}>
            Add income
            <PaidIcon sx={{ marginLeft: '12px' }}></PaidIcon>
          </Typography>
          <Typography className={classNames(styles.item, styles.button)}>
            Report a bug
            <BugReportIcon sx={{ marginLeft: '12px' }}></BugReportIcon>
          </Typography>
          <Typography className={classNames(styles.item, styles.button)}>
            Support me on Github
            <GitHubIcon sx={{ marginLeft: '12px' }}></GitHubIcon>
          </Typography>
        </Box>
      </Grid>
    </>
  );
}
