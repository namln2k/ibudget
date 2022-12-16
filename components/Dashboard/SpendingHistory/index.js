import { Grid, Typography } from '@mui/material';
import classNames from 'classnames';
import { useState } from 'react';
import styles from './SpendingHistory.module.scss';
import Item from './Item';

export default function BudgetLimits() {
  const [items, setItems] = useState([
    {
      amount: 12,
      description: 'Short, brief description',
      detail:
        'Long, detailed information about the transaction, but will be displayed briefly here'
    },
    {
      amount: -6243,
      description: 'Short, brief description'
    },
    {
      amount: 32992,
      description: 'Rather long and detailed description',
      detail:
        'Long, detailed information about the transaction, but will be displayed briefly here'
    },
    {
      amount: -5,
      description: 'Short, brief description',
      detail:
        'Long, detailed information about the transaction, but will be displayed briefly here'
    },
    {
      amount: 92475,
      description: 'Short, brief description'
    },
    {
      amount: -92475,
      description: 'Short, brief description'
    },
    {
      amount: -92475,
      description: 'Short, brief description',
      detail:
        'Long, detailed information about the transaction, but will be displayed briefly here'
    },
    {
      amount: 92475,
      description: 'Short, brief description',
      detail:
        'Long, detailed information about the transaction, but will be displayed briefly here'
    }
  ]);

  return (
    <>
      <Grid className={classNames(styles.section, styles.spendingHistory)}>
        <Typography className={classNames(styles.title)}>
          Spending History
        </Typography>
        <Grid className={classNames(styles.container)}>
          {items.map((item, index) => (
            <Item
              key={index}
              amount={item.amount}
              description={item.description}
              detail={item.detail}
            ></Item>
          ))}
        </Grid>
      </Grid>
    </>
  );
}
