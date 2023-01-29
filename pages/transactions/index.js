import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Grid, Typography } from '@mui/material';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import styles from './Transactions.module.scss';
import SpendingHistory from '../../components/Dashboard/SpendingHistory';
import TransactionDetail from '../../components/Transactions/Detail';
import FormAddTransaction from '../../components/Transactions/AddTransaction';

export default function Transactions(props) {
  const router = useRouter();

  const [action, setAction] = useState(router.query.action);

  const [transactionIdToView, setTransactionIdToView] = useState(null);

  const [needReload, setNeedReload] = useState();

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
              callback={() => {
                setNeedReload(Date.now());
                setAction('no-action');
              }}
            ></TransactionDetail>
          </Grid>
        );
      case 'add-income':
        return (
          <Grid className={styles.splash}>
            <FormAddTransaction
              type="income"
              callback={() => {
                setNeedReload(Date.now());
              }}
            ></FormAddTransaction>
          </Grid>
        );
      case 'add-expense':
        return (
          <Grid className={styles.splash}>
            <FormAddTransaction
              type="expense"
              callback={() => {
                setNeedReload(Date.now());
              }}
            ></FormAddTransaction>
          </Grid>
        );
      default:
        return <Grid className={styles.splash}></Grid>;
    }
  };

  useEffect(() => {
    setAction(router.query.action);
  }, [props]);

  const viewTransactionDetail = (id) => {
    setAction('detail');
    setTransactionIdToView(id);
  };

  const viewNewIncomeForm = () => {
    setAction('add-income');
  };

  const viewNewExpenseForm = () => {
    setAction('add-expense');
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
          <SpendingHistory
            callbackViewTransaction={viewTransactionDetail}
            needReload={needReload}
          ></SpendingHistory>
          <Grid sx={{ marginLeft: '36px' }}>
            {renderAction(action, transactionIdToView)}
          </Grid>
          <Grid className={classNames(styles.actions)}>
            <Grid sx={{ display: 'flex', gap: '20px' }}>
              <Grid
                className={classNames(styles.btn, styles.btnIncome)}
                onClick={viewNewIncomeForm}
              >
                <Typography sx={{ fontWeight: 500, fontSize: '20px' }}>
                  Add an income
                </Typography>
              </Grid>
              <Grid
                className={classNames(styles.btn, styles.btnExpense)}
                onClick={viewNewExpenseForm}
              >
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
