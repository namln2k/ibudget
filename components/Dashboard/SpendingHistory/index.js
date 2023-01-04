import { Grid, Typography } from '@mui/material';
import classNames from 'classnames';
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './SpendingHistory.module.scss';
import Item from './Item';
import { useUserContext } from '../../../contexts/user';
import FullScreenLoader from '../../FullScreenLoader';

export default function SpendingHistory(props) {
  const [items, setItems] = useState([]);

  const [user, setUser] = useUserContext();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function persistUserAndGetTransactions() {
      if (!!user) {
        const response = await axios.post('/api/auth/persist-user');
        const responseData = response.data;

        if (responseData.statusCode === 200) {
          setUser(responseData.data);

          const response = await axios.get(
            `/api/transactions/get?userId=${responseData.data._id}`
          );

          setItems(response.data.data);
          setIsLoading(false);
        }
      }
    }

    persistUserAndGetTransactions();
  }, []);

  return (
    <>
      <FullScreenLoader open={isLoading}></FullScreenLoader>
      <Grid className={classNames(styles.section, styles.spendingHistory)}>
        <Typography className={classNames(styles.title)}>
          Spending History
        </Typography>
        <Grid className={classNames(styles.container)}>
          {items.length > 0 &&
            items.map((item, index) => (
              <Item
                key={item._id}
                amount={item.amount}
                title={item.title}
                detail={item.detail}
                callback={props.callback}
                itemId={item._id}
              ></Item>
            ))}
          {items.length <= 0 && (
            <Grid
              className={classNames(styles.noItem)}
              flex={true}
              flexDirection="row"
            >
              <Typography variant="h6" sx={{ fontWeight: 400 }}>
                No transactions have been recorded!
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
}
