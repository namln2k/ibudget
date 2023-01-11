import { Grid, Typography } from '@mui/material';
import axios from 'axios';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useLoadingContext } from '../../../contexts/loading';
import { useUserContext } from '../../../contexts/user';
import FullScreenLoader from '../../FullScreenLoader';
import Item from './Item';
import styles from './SpendingHistory.module.scss';

export default function SpendingHistory(props) {
  const [items, setItems] = useState([]);

  const [user, setUser] = useUserContext();

  const [loading, setLoading] = useLoadingContext();

  useEffect(() => {
    async function persistUserAndGetTransactions() {
      if (!!user) {
        setLoading(true);
        const response = await axios.post('/api/auth/persist-user');
        const responseData = response.data;

        if (responseData.statusCode === 200) {
          setUser(responseData.data);

          const response = await axios.get(
            `/api/transactions/get?userId=${responseData.data._id}`
          );

          setItems(response.data.data);
          setLoading(false);
        }
      }
    }

    persistUserAndGetTransactions();
  }, []);

  return (
    <>
      <FullScreenLoader open={loading}></FullScreenLoader>
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
