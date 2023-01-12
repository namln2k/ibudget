import Head from 'next/head';
import classNames from 'classnames';
import { Grid } from '@mui/material';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import styles from './Dashboard.module.scss';
import Totals from '../../components/Dashboard/Totals';
import BudgetLimits from '../../components/Dashboard/BudgetLimits';
// import SpendingHistory from '../../components/Dashboard/SpendingHistory';
import QuickAccess from '../../components/Dashboard/QuickAccess';

export default function Dashboard(params) {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Header></Header>
      <main className={classNames(styles.main)}>
        <Sidebar></Sidebar>
        <Grid className={classNames(styles.sections)}>
          <Grid
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <Totals></Totals>
            <QuickAccess></QuickAccess>
          </Grid>
          <BudgetLimits></BudgetLimits>
          {/* <SpendingHistory></SpendingHistory> */}
        </Grid>
      </main>
      <Footer sx={{ background: '#808080' }}></Footer>
    </>
  );
}
