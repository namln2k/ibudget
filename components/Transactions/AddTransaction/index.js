import {
  Button,
  Grid,
  MenuItem,
  Select,
  TextareaAutosize,
  TextField,
  Typography
} from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import classNames from 'classnames';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useLoadingContext } from '../../../contexts/loading';
import MessageDialog from '../../MessageDialog';
import styles from './AddTransaction.module.scss';

const renderField = (field, content) => (
  <tr>
    <td>
      <Typography variant="h6" sx={{ margin: '6px' }}>
        {field + ':'}
      </Typography>
    </td>
    <td>{content}</td>
  </tr>
);

export default function FormAddTransaction(props) {
  const [loading, setLoading] = useLoadingContext();

  const [transaction, setTransaction] = useState({ time: moment() });

  const [categories, setCategories] = useState([]);

  const fieldTransactionTime = useRef();

  const [successMessage, setSuccessMessage] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);

    const response = await axios.get(`/api/categories/get`);

    setCategories(response.data.data);

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

  const handleSubmit = async (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      addTransaction();
    }
  };

  const addTransaction = async () => {
    let transactionToAdd = transaction;

    /**
     * Validate transaction inputs
     *
     * 1. Transaction title must not be left blank
     * 2. Transaction amount must not be left blank and must be a valid number
     * 3. Transaction time must be a valid time string
     */

    if (!transactionToAdd.title) {
      setErrorMessage('Transaction title must not be left blank!');
      return;
    }

    if (!transactionToAdd.amount) {
      setErrorMessage('Amount must not be left blank!');
      return;
    }

    try {
      transactionToAdd.time = transaction.time.toDate();
      if (props.type === 'income') {
        transactionToAdd.amount = Math.abs(transactionToAdd.amount);
      } else if (props.type === 'expense') {
        transactionToAdd.amount = -Math.abs(transactionToAdd.amount);
      }
    } catch (e) {
      setErrorMessage('Please enter a valid date!');
      return;
    }

    setLoading(true);

    const response = await axios.post(
      `/api/transactions/add`,
      transactionToAdd
    );
    const responseData = response.data;

    if (responseData.statusCode === 400) {
      setErrorMessage(responseData.error.toString());
    } else if (responseData.statusCode === 200) {
      setErrorMessage('');
      setSuccessMessage('Transaction added!');
      props.callback();
    } else {
      setErrorMessage('Something went wrong!');
    }

    setTransaction({ time: moment() });

    setLoading(false);
  };

  useEffect(() => {
    setTransaction({ time: moment() });
  }, [props.type]);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Grid className={classNames(styles.container)}>
          <MessageDialog type="error" open={errorMessage != ''}>
            {errorMessage}
          </MessageDialog>
          <MessageDialog type="success" open={successMessage != ''}>
            {successMessage}
          </MessageDialog>
          <Grid
            className={classNames(styles.fakeTable)}
            onKeyDown={handleSubmit}
          >
            <table>
              <tbody>
                {renderField(
                  'Transaction Time',
                  <DateTimePicker
                    className={classNames(styles.timePicker, styles.shortField)}
                    value={transaction.time}
                    inputFormat="DD/MM/YYYY hh:mm A"
                    onChange={(value) =>
                      setTransaction({
                        ...transaction,
                        time: moment(value)
                      })
                    }
                    renderInput={(params) => <TextField {...params} />}
                    ref={fieldTransactionTime}
                    sx={{ width: '80px' }}
                  />
                )}
                {renderField(
                  'Category',
                  <Select
                    value={transaction.category || ''}
                    displayEmpty
                    label="Category"
                    onChange={(event) =>
                      setTransaction({
                        ...transaction,
                        category: event.target.value
                      })
                    }
                    className={classNames(styles.select, styles.shortField)}
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
                    className={classNames(styles.textField, styles.longField)}
                    value={transaction.title || ''}
                    onChange={(event) =>
                      setTransaction({
                        ...transaction,
                        title: event.target.value
                      })
                    }
                    autoComplete="off"
                  />
                )}
                {renderField(
                  'Amount',
                  <TextField
                    required
                    placeholder="Amount"
                    variant="standard"
                    className={classNames(
                      styles.textField,
                      styles.shortField,
                      styles.fieldAmount,
                      props.type === 'income' ? styles.income : styles.expense
                    )}
                    value={transaction.amount || ''}
                    onChange={(event) =>
                      setTransaction({
                        ...transaction,
                        amount: event.target.value
                      })
                    }
                    autoComplete="off"
                  />
                )}
                {renderField(
                  'Detail',
                  <TextareaAutosize
                    required
                    placeholder="Detail"
                    variant="standard"
                    className={classNames(
                      styles.textArea,
                      styles.extraLongField,
                      styles.fieldDetail
                    )}
                    value={transaction.detail || ''}
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
            {props.type && (
              <Button
                className={classNames(
                  styles.btn,
                  props.type === 'income' && styles.income,
                  props.type === 'expense' && styles.expense
                )}
                onClick={addTransaction}
              >
                <Typography variant="h6" sx={{ textTransform: 'none' }}>
                  Submit
                </Typography>
              </Button>
            )}
          </Grid>
        </Grid>
      </LocalizationProvider>
    </>
  );
}
