import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import classNames from 'classnames';
import { Grid, Typography } from '@mui/material';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import styles from './Transactions.module.scss';
import SpendingHistory from '../../components/Dashboard/SpendingHistory';
import TransactionDetail from '../../components/Transactions/Detail';
import FormAddIncome from '../../components/Transactions/AddIncome'; 

export default function Transactions(props) {
  const router = useRouter();

  const [action, setAction] = useState(router.query.action);

  const [transactionIdToView, setTransactionIdToView] = useState(null);

  const renderAction = (action) => {
    switch (action) {
      case 'no-action':
        return (
          <Grid className={styles.splash}>
            <Typography sx={{ margin: '20px', fontWeight: 400 }} variant="h6">
              Select a transaction to view its detail
            </Typography>
          </Grid>
        );
      case 'detail':
        return (
          <Grid className={styles.splash}>
            <TransactionDetail
              transactionId={transactionIdToView}
            ></TransactionDetail>
          </Grid>
        );
      case 'add-income':
        return (
          <Grid className={styles.splash}>
            <FormAddIncome></FormAddIncome>
          </Grid>
        );
      default:
        return <Grid className={styles.splash}></Grid>;
    }
  };

  const viewTransactionDetail = (id) => {
    setAction('detail');
    setTransactionIdToView(id);
  };

  const viewNewIncomeForm = () => {
    setAction('add-income');
  };

  return (
    <>
      <Head>
        <title>Transactions</title>
      </Head>
      <Header></Header>
      <main className={classNames(styles.main)}>
        <Sidebar></Sidebar>
          <Grid className={classNames(styles.sections)}>
            <SpendingHistory callback={viewTransactionDetail}></SpendingHistory>
            <Grid>{renderAction(action, transactionIdToView)}</Grid>
            <Grid className={classNames(styles.actions)}>
              <Grid
                sx={{ display: 'flex', gap: '20px' }}
                onClick={viewNewIncomeForm}
              >
                <Grid className={classNames(styles.btn, styles.btnIncome)}>
                  <Typography sx={{ fontWeight: 500, fontSize: '20px' }}>
                    Add an income
                  </Typography>
                </Grid>
                <Grid className={classNames(styles.btn, styles.btnExpense)}>
                  <Typography sx={{ fontWeight: 500, fontSize: '20px' }}>
                    Add an expense
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
      </main>
      <Footer sx={{ background: '#808080' }}></Footer>
    </>
  );
}
