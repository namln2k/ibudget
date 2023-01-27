import DeleteIcon from '@mui/icons-material/Delete';
import { Grid, IconButton, Typography } from '@mui/material';
import axios from 'axios';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useLoadingContext } from '../../../contexts/loading';
import { useUserContext } from '../../../contexts/user';
import * as utilHelper from '../../../helpers/util';
import ConfirmDialog from '../../ConfirmDialog';
import FullScreenLoader from '../../FullScreenLoader';
import MessageDialog from '../../MessageDialog';
import styles from './Detail.module.scss';

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

export default function TransactionDetail({ transactionId, callback }) {
  const [transaction, setTransaction] = useState({});

  const { _id, amount, detail, time, status, title, category } = transaction;

  const [user, setUser] = useUserContext();

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const [loading, setLoading] = useLoadingContext();

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

  useEffect(() => {
    setLoading(true);
    const getTransactionById = async () => {
      const response = await axios.get(
        `/api/transactions/get?id=${transactionId}`
      );

      const transaction = response.data.data;

      if (!transaction) {
        callback();
        setLoading(false);
        return;
      }

      setTransaction(response.data.data);
      setLoading(false);
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
        <Grid className={classNames(styles.checkIcon)} key={_id}>
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
        <Grid className={classNames(styles.crossIcon)} key={_id}>
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

  const openConfirmDialog = () => {
    setIsConfirmDialogOpen(true);
  };

  const deleteTransaction = async (transactionId) => {
    setLoading(true);

    const response = await axios.get(
      `/api/transactions/delete/?id=${transactionId}&userId=${user._id}`
    );
    const responseData = response.data;

    if (responseData.statusCode === 400) {
      setErrorMessage(responseData.error.toString());
    } else if (responseData.statusCode === 200) {
      const deletedCount = responseData.data.deletedCount;

      if (deletedCount != 1) {
        setSuccessMessage('');
        setErrorMessage(
          'Something went wrong. The transaction may not have been deleted!'
        );
      } else {
        setErrorMessage('');
        setSuccessMessage(`The transaction has been deleted!`);
      }

      callback();
    } else {
      setErrorMessage('Something went wrong!');
    }

    setLoading(false);
  };

  const handleDelete = () => {
    deleteTransaction(transactionId);
  };

  useEffect(() => {
    let timeoutId;

    if (successMessage != '') {
      setErrorMessage('');
      timeoutId = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [successMessage]);

  useEffect(() => {
    let timeoutId;

    if (errorMessage != '') {
      timeoutId = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [errorMessage]);

  return (
    <>
      <FullScreenLoader open={loading}></FullScreenLoader>
      <MessageDialog type="error" open={errorMessage != ''}>
        {errorMessage}
      </MessageDialog>
      <MessageDialog type="success" open={successMessage != ''}>
        {successMessage}
      </MessageDialog>
      <ConfirmDialog
        title="Are you sure?"
        content="Please make sure you want to delete this transaction!"
        isOpen={isConfirmDialogOpen}
        handleConfirm={() => {
          handleDelete();
          setIsConfirmDialogOpen(false);
        }}
        handleClose={() => {
          setIsConfirmDialogOpen(false);
        }}
      ></ConfirmDialog>
      <Grid className={classNames(styles.container)}>
        <Grid className={classNames(styles.box)}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <Grid className={classNames(styles.btn, styles.btnDelete)}>
            <IconButton
              aria-label="delete"
              size="large"
              onClick={openConfirmDialog}
            >
              <Typography>Delete</Typography>
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </Grid>
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
