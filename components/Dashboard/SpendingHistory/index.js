import { Divider, Grid, Typography } from '@mui/material';
import axios from 'axios';
import classNames from 'classnames';
import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import { useLoadingContext } from '../../../contexts/loading';
import { useUserContext } from '../../../contexts/user';
import FullScreenLoader from '../../FullScreenLoader';
import Item from './Item';
import styles from './SpendingHistory.module.scss';

const needLineBreak = (time1, time2) => {
  if (!time2) return false;

  const month1 = moment(time1).month();
  const month2 = moment(time2).month();

  if (month1 != month2) return moment(time2).format('MM-YYYY');

  return false;
};

export default function SpendingHistory(props) {
  const [items, setItems] = useState([]);

  const [user, setUser] = useUserContext();

  const [loading, setLoading] = useLoadingContext();

  const persistUserAndGetTransactions = async () => {
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
  };

  useEffect(() => {
    persistUserAndGetTransactions();
  }, [props.needReload]);

  return (
    <>
      <FullScreenLoader open={loading}></FullScreenLoader>
      <Grid className={classNames(styles.section, styles.spendingHistory)}>
        <Typography className={classNames(styles.title)}>
          Spending History
        </Typography>
        <Grid className={classNames(styles.container)}>
          {items.length > 0 && (
            <>
              <Divider textAlign="left" sx={{ marginBottom: '6px' }}>
                <Typography variant="h6">
                  {moment(items[0].time).format('MM-YYYY')}
                </Typography>
              </Divider>
              {items.map((item, index) => (
                <Grid key={item._id}>
                  <Item
                    key={item._id}
                    amount={item.amount.$numberDecimal}
                    title={item.title}
                    detail={item.detail}
                    callback={props.callbackViewTransaction}
                    itemId={item._id}
                  ></Item>
                  {needLineBreak(item.time, items[index + 1]?.time) && (
                    <Divider textAlign="left" sx={{ marginBottom: '6px' }}>
                      <Typography variant="h6">
                        {needLineBreak(item.time, items[index + 1]?.time)}
                      </Typography>
                    </Divider>
                  )}
                </Grid>
              ))}
            </>
          )}
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
