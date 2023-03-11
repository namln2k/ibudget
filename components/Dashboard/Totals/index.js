import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Box, Grid, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import classNames from 'classnames';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useLoadingContext } from '../../../contexts/loading';
import { useUserContext } from '../../../contexts/user';
import * as utilHelper from '../../../helpers/util';
import styles from './Totals.module.scss';

export default function Totals() {
  const [user, setUser] = useUserContext();

  const [loading, setLoading] = useLoadingContext();

  const router = useRouter();

  useEffect(() => {
    async function persistUser() {
      if (!!user) {
        setLoading(true);
        const response = await axios.post('/api/auth/persist-user');
        const responseData = response.data;

        if (responseData.statusCode === 200) {
          setUser(responseData.data);
        }
      }

      setLoading(false);
    }

    persistUser();
  }, []);

  return (
    <>
      <Grid className={classNames(styles.section, styles.totals)}>
        <Grid className={classNames(styles.title)}>
          <Box className={classNames(styles.titleContainer)}>
            <Typography className={classNames(styles.title)}>
              Your balance
            </Typography>
            <AccountBalanceWalletIcon
              fontSize="large"
              color="success"
              sx={{ marginLeft: '12px', marginTop: '4px' }}
            ></AccountBalanceWalletIcon>
          </Box>
        </Grid>
        <Grid className={classNames(styles.content)}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              readOnly
              value={moment()}
              renderInput={(params) => <TextField {...params} />}
              onChange={() => {}}
              inputFormat="DD/MM/YYYY"
              className={classNames(styles.today)}
            />
          </LocalizationProvider>
          {user?.balance && (
            <Grid
              className={classNames(styles.amount)}
              onClick={() => {
                router.push('/me');
              }}
            >
              <Typography className={classNames(styles.number)}>
                {utilHelper.formatCurrency(user?.balance?.$numberDecimal)}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
}
