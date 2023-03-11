import { Grid, Typography } from '@mui/material';
import classNames from 'classnames';
import React from 'react';
import * as utilHelper from '../../../../helpers/util';
import Icon from './Icon';
import styles from './Item.module.scss';

const renderAmount = (amount) => {
  const amountToString = utilHelper.formatCurrency(amount);

  if (amount > 0) {
    return (
      <>
        <Grid
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Grid
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
              alignItems: 'center'
            }}
          >
            <Icon type="income"></Icon>
            <Typography
              fontWeight={500}
              fontSize="medium"
              sx={{
                width: '132px'
              }}
            >
              {amountToString}
            </Typography>
          </Grid>
        </Grid>
      </>
    );
  } else {
    return (
      <>
        <Grid
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Grid
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
              alignItems: 'center'
            }}
          >
            <Icon type="expense"></Icon>
            <Typography
              fontWeight={500}
              fontSize="medium"
              sx={{
                width: '132px'
              }}
            >
              {amountToString}
            </Typography>
          </Grid>
        </Grid>
      </>
    );
  }
};

const parseLines = (text) => text.replace(/(\\n)/g, '\n');

export default function Item({ amount, title, detail, callback, itemId }) {
  return (
    <>
      <Grid
        className={classNames(styles.item)}
        flex={true}
        flexDirection="row"
        onClick={() => callback && callback(itemId)}
      >
        <Grid>{renderAmount(amount)}</Grid>
        <Grid className={classNames(styles.content)}>
          <Typography className={classNames(styles.title)}>{title}</Typography>
          <Typography className={classNames(styles.detail)}>
            {detail && parseLines(detail)}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}
