import React, { useEffect, useRef, useState } from 'react';
import {
  Grid,
  Typography,
  TextField,
  TextareaAutosize,
  Button,
  Select,
  MenuItem
} from '@mui/material';
import classNames from 'classnames';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import styles from './AddTransaction.module.scss';
import FullScreenLoader from '../../FullScreenLoader';
import { useUserContext } from '../../../contexts/user';
import axios from 'axios';
import moment from 'moment';

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
  const [loading, setLoading] = useState(false);

  const [transaction, setTransaction] = useState({ time: moment() });

  const [user, setUser] = useUserContext();

  const [categories, setCategories] = useState([]);

  const fieldTransactionTime = useRef();

  useEffect(() => {
    persistUserAndGetCategories();
  }, []);

  const persistUserAndGetCategories = async () => {
    setLoading(true);
    if (!!user) {
      const response = await axios.post('/api/auth/persist-user');
      const responseData = response.data;

      if (responseData.statusCode === 200) {
        setUser(responseData.data);

        const response = await axios.get(
          `/api/categories/get?userId=${responseData.data._id}`
        );

        setCategories(response.data.data);
      }
    } else {
      const response = await axios.get(
        `/api/categories/get?userId=${user._id}`
      );

      setCategories(response.data.data);
    }

    setLoading(false);
  };

  const handleSubmit = async (event) => {
    if (event.keyCode === 13) {
      addTransaction();
    }
  };

  const addTransaction = async () => {
    let transactionToAdd = transaction;
    transactionToAdd.time = transaction.time.toDate();
    transactionToAdd.userId = user._id;

    if (props.type === 'income') {
      transactionToAdd.amount = Math.abs(transactionToAdd.amount);
    } else if (props.type === 'expense') {
      transactionToAdd.amount = -Math.abs(transactionToAdd.amount);
    }

    await axios.post(`/api/transactions/add`, transactionToAdd);

    setTransaction({ time: moment() });
    props.callback();
  };

  useEffect(() => {
    setTransaction({ time: moment() });
  }, [props.type]);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Grid className={classNames(styles.container)}>
          <FullScreenLoader open={loading}></FullScreenLoader>
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
                    onChange={(value) =>
                      setTransaction({
                        ...transaction,
                        time: value
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
