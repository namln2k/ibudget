import { Grid, Typography, Box, Divider } from '@mui/material';
import classNames from 'classnames';
import { useState } from 'react';
import styles from './GoalsBudget.module.scss';
import Item from './Item';

export default function GoalsBudget() {
  const [items, setItems] = useState([
    { title: 'Budget category 1', progress: 25 },
    { title: 'Budget category 2', progress: 100 },
    { title: 'Budget category 3', progress: 90 },
    { title: 'Budget category 4', progress: 45 },
    { title: 'Budget category 5', progress: 55 },
    { title: 'Budget category 6', progress: 65 }
  ]);

  return (
    <>
      <Grid className={classNames(styles.section, styles.goalsBudget)}>
        <Typography className={classNames(styles.title)}>
          Goals Budget
        </Typography>
        <Grid className={classNames(styles.container)}>
          {items.map((item, index) => (
            <Item title={item.title} progress={item.progress} key={index} index={index}></Item>
          ))}
        </Grid>
      </Grid>
    </>
  );
}
