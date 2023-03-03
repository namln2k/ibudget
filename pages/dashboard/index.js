import { Grid } from '@mui/material';
import classNames from 'classnames';
import Head from 'next/head';
import { useRouter } from 'next/router';
import QuickAccess from '../../components/Dashboard/QuickAccess';
import RandomQuote from '../../components/Dashboard/RandomQuote';
import SpendingHistory from '../../components/Dashboard/SpendingHistory';
import Totals from '../../components/Dashboard/Totals';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import styles from './Dashboard.module.scss';

export default function Dashboard(props) {
  const router = useRouter();

  const viewTransactionDetail = (transactionId) => {
    router.push({
      pathname: '/transactions',
      as: 'transactions',
      query: {
        action: 'detail',
        viewDetailFromDashboard: transactionId
      }
    });
  };

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Header></Header>
      <main className={classNames(styles.main)}>
        <Sidebar></Sidebar>
        <Grid className={classNames(styles.sections)}>
          <SpendingHistory
            callbackViewTransaction={viewTransactionDetail}
          ></SpendingHistory>
          <Grid
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <Totals></Totals>
            <RandomQuote></RandomQuote>
          </Grid>
          <QuickAccess></QuickAccess>
        </Grid>
      </main>
      <Footer sx={{ background: '#808080' }}></Footer>
    </>
  );
}
