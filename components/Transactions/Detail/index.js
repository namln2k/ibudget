import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextareaAutosize,
  TextField,
  Typography
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import axios from 'axios';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useLoadingContext } from '../../../contexts/loading';
import * as utilHelper from '../../../helpers/util';
import ConfirmDialog from '../../ConfirmDialog';
import MessageDialog from '../../MessageDialog';
import styles from './Detail.module.scss';

const renderField = (field, content) => (
  <tr>
    <td>
      <Typography
        variant="h6"
        sx={{
          height: '64px',
          display: 'block',
          lineHeight: '64px',
          fontWeight: 500
        }}
      >
        {field + ':'}
      </Typography>
    </td>
    <td>{content}</td>
  </tr>
);

export default function TransactionDetail({ transactionId, callback }) {
  const [transaction, setTransaction] = useState({});

  const { _id, amount, detail, time, status, title } = transaction;

  const [categories, setCategories] = useState([]);

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const [loading, setLoading] = useLoadingContext();

  const fetchCategories = async () => {
    setLoading(true);

    const response = await axios.get(`/api/categories/get`);

    setCategories(response.data.data);

    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setLoading(true);
    const getTransactionById = async () => {
      const response = await axios.get(
        `/api/transactions/get/${transactionId}`
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
      `/api/transactions/delete/${transactionId}`
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

  const updateTransaction = async () => {
    setLoading(true);

    const transactionToUpdate = {
      ...transaction,
      category: transaction.category?._id
    };

    const response = await axios.post(
      `/api/transactions/edit/${transactionId}`,
      transactionToUpdate
    );

    const responseData = response.data;

    if (responseData.statusCode === 400) {
      setErrorMessage(responseData.error.toString());
    } else if (responseData.statusCode === 200) {
      setErrorMessage('');
      setSuccessMessage(`The transaction has been updated!`);

      callback();
    } else {
      setErrorMessage('Something went wrong!');
    }

    setLoading(false);
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
      <LocalizationProvider dateAdapter={AdapterMoment}>
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
            <Grid className={classNames(styles.btn, styles.btnUpdate)}>
              <IconButton size="large" onClick={updateTransaction}>
                <Typography>Update</Typography>
                <EditIcon />
              </IconButton>
            </Grid>
            <Grid className={classNames(styles.btn, styles.btnDelete)}>
              <IconButton size="large" onClick={openConfirmDialog}>
                <Typography>Delete</Typography>
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </Grid>
            <Grid className={classNames(styles.content)}>
              <Grid className={classNames(styles.transactionStatus)}>
                {renderIcon(status)}
                {status && (
                  <Typography>{status ? 'Success' : 'Failure'}</Typography>
                )}
                <Grid
                  sx={{
                    minWidth: '200px'
                  }}
                >
                  {amount && (
                    <Typography
                      className={classNames(
                        amount.$numberDecimal > 0
                          ? styles.income
                          : styles.expense
                      )}
                      variant="h4"
                      sx={{
                        padding: '0 36px',
                        width: 'fit-content',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                      }}
                    >
                      {(amount.$numberDecimal > 0 ? '+' : '-') +
                        utilHelper.formatCurrency(amount.$numberDecimal)}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid
                className={classNames(
                  styles.fakeTable,
                  styles.transactionDetail
                )}
              >
                <table>
                  <tbody>
                    {renderField(
                      'Transaction ID',
                      <Typography>{_id}</Typography>
                    )}
                    {renderField(
                      'Amount',
                      amount && (
                        <TextField
                          required
                          variant="standard"
                          value={amount.$numberDecimal}
                          onChange={(event) =>
                            setTransaction({
                              ...transaction,
                              amount: { $numberDecimal: event.target.value }
                            })
                          }
                          sx={{ marginTop: '-10px' }}
                        />
                      )
                    )}
                    {renderField(
                      'Time',
                      <DateTimePicker
                        className={classNames(styles.timePicker)}
                        value={time}
                        onChange={(value) =>
                          setTransaction({
                            ...transaction,
                            time: value
                          })
                        }
                        renderInput={(params) => <TextField {...params} />}
                      />
                    )}
                    {renderField(
                      'Category',
                      <Select
                        value={transaction.category?._id || ''}
                        displayEmpty
                        label="Category"
                        onChange={(event) =>
                          setTransaction({
                            ...transaction,
                            category: categories.find(
                              (cate) => cate._id == event.target.value
                            )
                          })
                        }
                      >
                        <MenuItem value={''}>None</MenuItem>
                        {categories.map((category) => (
                          <MenuItem key={category._id} value={category._id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                    {renderField(
                      'Title',
                      <TextField
                        required
                        placeholder="Title"
                        variant="standard"
                        value={title || ''}
                        onChange={(event) =>
                          setTransaction({
                            ...transaction,
                            title: event.target.value
                          })
                        }
                        sx={{ marginTop: '-10px', width: '100%' }}
                      />
                    )}
                    {renderField(
                      'Detail',
                      <TextareaAutosize
                        placeholder="Transaction detail"
                        variant="standard"
                        className={classNames(styles.textArea)}
                        value={detail || ''}
                        onChange={(event) =>
                          setTransaction({
                            ...transaction,
                            detail: event.target.value
                          })
                        }
                        minRows={3}
                        maxRows={8}
                      />
                    )}
                  </tbody>
                </table>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </>
  );
}
