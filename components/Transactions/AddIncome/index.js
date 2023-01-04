import React, { useEffect, useRef, useState } from 'react';
import { Grid, Typography, TextField } from '@mui/material';
import classNames from 'classnames';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Autocomplete from '@mui/material/Autocomplete';
import styles from './AddIncome.module.scss';
import FullScreenLoader from '../../FullScreenLoader';
import * as utilHelper from '../../../helpers/util';

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
  'Necessaries',
  'Financial Freedom',
  'Long-term Saving',
  'Education Account',
  'Play Account',
  'Give',
  'None',
  'Others'
];

export default function FormAddIncome() {
  const [isLoading, setIsLoading] = useState(false);

  const [transaction, setTransaction] = useState({});

  console.log(transaction);

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
                    className={classNames(styles.timePicker)}
                    value={transaction.time}
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
                    onChange={(event, value) =>
                      setTransaction({ ...transaction, category: value })
                    }
                  />
                )}
                {renderField(
                  'Title',
                  <TextField
                    required
                    placeholder="Title"
                    variant="standard"
                    value={transaction.title}
                    onChange={(event) =>
                      setTransaction({
                        ...transaction,
                        title: event.target.value
                      })
                    }
                  />
                )}
                {renderField(
                  'Detail',
                  <TextField
                    required
                    placeholder="Detail"
                    variant="standard"
                    value={transaction.detail}
                    onChange={(event) =>
                      setTransaction({
                        ...transaction,
                        title: event.target.value
                      })
                    }
                  />
                )}
              </tbody>
            </table>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </>
  );
}
