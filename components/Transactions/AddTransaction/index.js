import React, { useEffect, useRef, useState } from 'react';
import {
  Grid,
  Typography,
  TextField,
  TextareaAutosize,
  Button
} from '@mui/material';
import classNames from 'classnames';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Autocomplete from '@mui/material/Autocomplete';
import styles from './AddTransaction.module.scss';
import FullScreenLoader from '../../FullScreenLoader';
import * as utilHelper from '../../../helpers/util';
import { now } from 'moment';

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

const categories = [
  'None',
  'Necessaries',
  'Financial Freedom',
  'Long-term Saving',
  'Education Account',
  'Play Account',
  'Give',
  'Others'
];

export default function FormAddTransaction(props) {
  const [isLoading, setIsLoading] = useState(false);

  const [transaction, setTransaction] = useState({});

  useEffect(() => {
    setTransaction({});
  }, [props.type]);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Grid className={classNames(styles.container)}>
          <FullScreenLoader open={isLoading}></FullScreenLoader>
          <Grid className={classNames(styles.fakeTable)}>
            <table>
              <tbody>
                {renderField(
                  'Transaction Time',
                  <DateTimePicker
                    className={classNames(styles.timePicker, styles.shortField)}
                    value={transaction.time || now()}
                    onChange={(value) =>
                      setTransaction({
                        ...transaction,
                        time: value
                      })
                    }
                    renderInput={(params) => <TextField {...params} />}
                    sx={{ width: '80px' }}
                  />
                )}
                {renderField(
                  'Category',
                  <Autocomplete
                    disablePortal
                    options={categories}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Category" />
                    )}
                    value={transaction.category || categories[0]}
                    onChange={(event, value) =>
                      setTransaction({ ...transaction, category: value })
                    }
                    className={classNames(
                      styles.autocompleteSelect,
                      styles.shortField
                    )}
                  />
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
              >
                <Typography variant="h6" sx={{ textTransform: 'none' }}>
                  {props.type === 'income' ? 'Add income' : 'Add expense'}
                </Typography>
              </Button>
            )}
          </Grid>
        </Grid>
      </LocalizationProvider>
    </>
  );
}
