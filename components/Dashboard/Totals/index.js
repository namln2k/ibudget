import { Grid, Typography, Box, Divider } from '@mui/material';
import classNames from 'classnames';
import { useState } from 'react';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import styles from './Totals.module.scss';
import Select from '../../Select';
import * as utilHelper from '../../../helpers/util';

export default function Totals() {
  const filterOptions = [
    { value: 0, label: 'Today' },
    { value: 1, label: 'This week' },
    { value: 2, label: 'This month' },
    { value: 4, label: 'This year' }
  ];

  const defaultFilterOption = filterOptions[0];

  const [filterOption, setFilterOption] = useState(defaultFilterOption.value);

  const handleChange = (value) => {
    setFilterOption(value);
  };

  return (
    <>
      <Grid className={classNames(styles.section, styles.totals)}>
        <Typography className={classNames(styles.title)}>Totals</Typography>
        <Grid className={classNames(styles.filterSelect)}>
          <Select
            width="100%"
            options={filterOptions}
            onChange={(value) => handleChange(value)}
            defaultValue={defaultFilterOption}
          />
        </Grid>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '12px'
          }}
        >
          <Grid className={classNames(styles.part)}>
            <Box className={classNames(styles.titleContainer)}>
              <Typography className={classNames(styles.title)}>
                Earnings
              </Typography>
              <AddBoxOutlinedIcon
                fontSize="large"
                color="success"
              ></AddBoxOutlinedIcon>
            </Box>
            <Grid className={classNames(styles.amount)}>
              <Typography className={classNames(styles.number)}>
                {utilHelper.separateByThousand(1234567)}
              </Typography>
              <Typography className={classNames(styles.currency)}>$</Typography>
            </Grid>
            <Grid className={classNames(styles.compare)}>
              <KeyboardDoubleArrowDownIcon className={classNames(styles.icon)}></KeyboardDoubleArrowDownIcon>
              <Typography className={classNames(styles.amount)}>12% from last month</Typography>
            </Grid>
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid className={classNames(styles.part)}>
            <Box className={classNames(styles.titleContainer)}>
              <Typography className={classNames(styles.title)}>
                Expenses
              </Typography>
              <IndeterminateCheckBoxOutlinedIcon
                fontSize="large"
                color="error"
              ></IndeterminateCheckBoxOutlinedIcon>
            </Box>
            <Grid className={classNames(styles.amount)}>
              <Typography className={classNames(styles.number)}>
              {utilHelper.separateByThousand(1234)}
              </Typography>
              <Typography className={classNames(styles.currency)}>$</Typography>
            </Grid>
            <Grid className={classNames(styles.compare)}>
              <KeyboardDoubleArrowUpIcon className={classNames(styles.icon)}></KeyboardDoubleArrowUpIcon>
              <Typography className={classNames(styles.amount)}>12% from last month</Typography>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </>
  );
}
