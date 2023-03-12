import { Button, Divider, Grid, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import axios from 'axios';
import classNames from 'classnames';
import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import { useLoadingContext } from '../../../contexts/loading';
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

  const [renderItems, setRenderItems] = useState([]);

  const [loading, setLoading] = useLoadingContext();

  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);

    const response = await axios.get(`/api/transactions/get`);

    setItems(response.data.data);

    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [props.needReload]);

  useEffect(() => {
    if (from && to) {
      setRenderItems(
        items.filter((e) => moment(e.time).isBetween(from, to, 'days', '[]'))
      );
    } else if (from) {
      setRenderItems(items.filter((e) => moment(e.time).isSameOrAfter(from)));
    } else if (to) {
      setRenderItems(items.filter((e) => moment(e.time).isSameOrBefore(to)));
    } else {
      setRenderItems(items);
    }
  }, [from, to, items]);

  return (
    <>
      <Grid className={classNames(styles.section, styles.spendingHistory)}>
        <Typography className={classNames(styles.title)}>
          Spending History
        </Typography>
        <Grid className={classNames(styles.container)}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <Grid
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '20px',
                marginBottom: '20px'
              }}
            >
              <Box>
                <Typography>From</Typography>
                <DesktopDatePicker
                  inputFormat="DD/MM/YYYY"
                  value={from}
                  onChange={(newValue) => setFrom(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                  className={classNames(styles.datePicker)}
                />
              </Box>
              <Box>
                <Typography>To</Typography>
                <DesktopDatePicker
                  inputFormat="DD/MM/YYYY"
                  value={to}
                  onChange={(newValue) => setTo(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                  className={classNames(styles.datePicker)}
                />
              </Box>
              <Button
                onClick={() => {
                  setFrom(null);
                  setTo(null);
                }}
                variant="outlined"
                sx={{ height: '50%', margin: 'auto' }}
              >
                Reset
              </Button>
            </Grid>
          </LocalizationProvider>
          {renderItems.length > 0 && (
            <>
              <Divider textAlign="left" sx={{ marginBottom: '6px' }}>
                <Typography variant="h6">
                  {moment(renderItems[0].time).format('MM-YYYY')}
                </Typography>
              </Divider>
              {renderItems.map((item, index) => (
                <Grid key={item._id}>
                  <Item
                    key={item._id}
                    amount={item.amount.$numberDecimal}
                    title={item.title}
                    detail={item.detail}
                    callback={props.callbackViewTransaction}
                    itemId={item._id}
                  ></Item>
                  {needLineBreak(item.time, renderItems[index + 1]?.time) && (
                    <Divider textAlign="left" sx={{ marginBottom: '6px' }}>
                      <Typography variant="h6">
                        {needLineBreak(item.time, renderItems[index + 1]?.time)}
                      </Typography>
                    </Divider>
                  )}
                </Grid>
              ))}
            </>
          )}
          {renderItems.length <= 0 && (
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
