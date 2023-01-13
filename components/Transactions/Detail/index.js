import React, { useEffect, useRef, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import classNames from 'classnames';
import axios from 'axios';
import styles from './Detail.module.scss';
import FullScreenLoader from '../../FullScreenLoader';
import * as utilHelper from '../../../helpers/util';

const renderField = (field, content) => (
  <tr>
    <td>
      <Typography variant="h6" sx={{ margin: '10px 6px', fontWeight: 500 }}>
        {field + ':'}
      </Typography>
    </td>
    <td>
      <Typography sx={{ fontWeight: 400, margin: '10px 6px' }}>
        {content}
      </Typography>
    </td>
  </tr>
);

export default function TransactionDetail({ transactionId }) {
  const checkMark = useRef();
  const cross = useRef();
  const [transaction, setTransaction] = useState({});
  const { _id, amount, detail, time, status, title, category } = transaction;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const getTransactionById = async () => {
      const response = await axios.get(
        `/api/transactions/get?id=${transactionId}`
      );
      setTransaction(response.data.data);
      setIsLoading(false);
    };

    getTransactionById();
  }, [transactionId]);

  const renderIcon = (status) => {
    if (status === 0) {
      return renderCross();
    } else {
      return renderCheckMark();
    }
  };

  const renderCheckMark = () => {
    return (
      <Grid className={classNames(styles.circle)}>
        <Grid
          className={classNames(styles.checkIcon)}
          key={_id}
          ref={checkMark}
        >
          <Grid className={classNames(styles.checkLine, styles.lineTip)}></Grid>
          <Grid
            className={classNames(styles.checkLine, styles.lineLong)}
          ></Grid>
          <Grid className={classNames(styles.checkCircle)}></Grid>
          <Grid className={classNames(styles.checkFix)}></Grid>
        </Grid>
      </Grid>
    );
  };

  const renderCross = () => {
    return (
      <Grid className={classNames(styles.circle)}>
        <Grid className={classNames(styles.crossIcon)} key={_id} ref={cross}>
          <Grid
            className={classNames(styles.crossLine, styles.leftCross)}
          ></Grid>
          <Grid
            className={classNames(styles.crossLine, styles.rightCross)}
          ></Grid>
          <Grid className={classNames(styles.crossCircle)}></Grid>
          <Grid className={classNames(styles.crossFix)}></Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <FullScreenLoader open={isLoading}></FullScreenLoader>
      <Grid className={classNames(styles.container)}>
        <Grid className={classNames(styles.box)}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <Grid className={classNames(styles.content)}>
            {renderIcon(status)}
            {status && (
              <Typography>{status ? 'Success' : 'Failure'}</Typography>
            )}
            {amount && (
              <Grid>
                <Typography
                  className={classNames(
                    amount.$numberDecimal > 0 ? styles.income : styles.expense
                  )}
                  variant="h4"
                  sx={{ marginTop: '20px' }}
                >
                  {(amount.$numberDecimal > 0 ? '+ ' : '- ') +
                    utilHelper.formatCurrency(amount.$numberDecimal)}
                </Typography>
              </Grid>
            )}
            <Grid className={classNames(styles.fakeTable)}>
              <table>
                <tbody>
                  {renderField('Transaction ID', _id)}
                  {renderField('Time', utilHelper.mongoDateToString(time))}
                  {renderField('Category', category?.name || 'None')}
                  {renderField('Title', title)}
                  {renderField('Detail', detail)}
                </tbody>
              </table>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
