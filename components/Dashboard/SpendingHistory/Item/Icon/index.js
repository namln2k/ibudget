import React from 'react';
import { Grid, Box } from '@mui/material';
import classNames from 'classnames';
import styles from './Icon.module.scss';

const renderIcon = (type) => {
  switch (type) {
    case 'income':
      return (
        <>
          <Box
            sx={{
              position: 'absolute',
              width: '18px',
              height: 0,
              left: '8px',
              top: '18px',
              border: '2px solid #00C814',
              borderRadius: '4px'
            }}
          ></Box>
          <Box
            sx={{
              position: 'absolute',
              width: '18px',
              height: 0,
              left: '8px',
              top: '18px',
              border: '2px solid #00C814',
              borderRadius: '4px',
              transform: 'rotate(-90deg)'
            }}
          ></Box>
        </>
      );
    case 'expense': {
      return (
        <>
          <Box
            sx={{
              position: 'absolute',
              width: '18px',
              height: 0,
              left: '8px',
              top: '18px',
              border: '2px solid #ED1E1E',
              borderRadius: '4px'
            }}
          ></Box>
        </>
      );
    }
  }
};

export default function Icon({ type }) {
  return <Grid className={classNames(styles.icon)}>{renderIcon(type)}</Grid>;
}
