import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField
} from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { formatCurrency } from '../../helpers/util';
import { chartColors } from '../../pages/charts';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false
});

const getUniqueNames = (data) => {
  const names = data.map((item) => item.name);
  return [...new Set(names)].sort();
};

const dayCount = 7;

const Weekly = ({ data }) => {
  const [spendingType, setSpendingType] = useState(2);
  const [endDate, setEndDate] = useState(moment(new Date()).subtract(1, 'day'));
  const [series, setSeries] = useState([]);
  const [chartCategories, setChartCategories] = useState([]);

  const handleChangeEndDate = (newValue) => {
    setEndDate(newValue);
  };

  const handleChangeSpending = (e) => {
    setSpendingType(e.target.value);
  };

  const chartOptions = {
    series,
    options: {
      chart: {
        type: 'bar',
        height: 450,
        stacked: true,
        toolbar: {
          show: false
        }
      },
      colors: chartColors,
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            total: {
              enabled: true,
              style: {
                fontSize: '13px',
                fontWeight: 900
              }
            }
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => formatCurrency(val)
      },
      xaxis: { categories: chartCategories },
      yaxis: {
        title: {
          text: 'VND'
        }
      },
      legend: {
        position: 'right',
        offsetY: 40
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: (val) => formatCurrency(val)
        }
      },
      title: {
        text: 'Chart title',
        align: 'center',
        style: {
          fontSize: '24px',
          fontWeight: 'bold'
        }
      }
    }
  };

  useEffect(() => {
    const rawData = Array.from({ length: dayCount }, (_, i) => {
      return data
        .filter(
          (item) =>
            [1, 2].includes(item.category_type) &&
            item.spending_type === spendingType &&
            moment(item.created_at).subtract(1, 'day').format('DD/MM/YYYY') ===
              moment(endDate).subtract(i, 'day').format('DD/MM/YYYY')
        )
        .map((item) => {
          if (item.category_type === 2) {
            return {
              data: Math.abs(Number(item.amount.$numberDecimal)),
              name: item.category_id.name
            };
          } else {
            return {
              data: Math.abs(Number(item.amount.$numberDecimal)),
              name: 'Other'
            };
          }
        })
        .sort((a, b) => (a.name > b.name ? 1 : -1));
    }).reverse();

    const categoriesList = getUniqueNames(
      rawData.reduce((a, b) => a.concat(b), [])
    );
    setSeries(
      categoriesList.map((category) => ({
        name: category,
        data: rawData.map((item) => {
          const found = item.find((el) => el.name === category);
          if (found) {
            return found.data;
          }
          return 0;
        })
      }))
    );

    setChartCategories(
      Array.from({ length: dayCount }, (_, i) =>
        moment(endDate).subtract(i, 'day').format('DD/MM/YYYY')
      ).reverse()
    );
  }, [spendingType, endDate]);

  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ minWidth: 120 }}>
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel id="spending">Spending Type</InputLabel>
            <Select
              labelId="spending"
              id="select-spending"
              value={spendingType}
              label="Spending Type"
              onChange={handleChangeSpending}
            >
              <MenuItem value={1}>Income</MenuItem>
              <MenuItem value={2}>Expense</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 120 }}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DesktopDatePicker
              label="End Date"
              inputFormat="DD/MM/YYYY"
              value={endDate}
              onChange={handleChangeEndDate}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Box>
      </Stack>

      <Box
        sx={{
          mt: 5
        }}
      >
        <Chart
          options={chartOptions.options}
          series={chartOptions.series}
          type="bar"
          height={500}
          width="100%"
        />
      </Box>
    </>
  );
};

export default Weekly;
