import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import axios from 'axios';
import moment from 'moment';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { useLoadingContext } from '../../contexts/loading';
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

const Weekly = () => {
  const [data, setData] = useState([]);
  const [spendingType, setSpendingType] = useState(2);
  const [endDate, setEndDate] = useState(moment(new Date()).subtract(1, 'day'));
  const [series, setSeries] = useState([]);
  const [chartCategories, setChartCategories] = useState([]);
  const [loading, setLoading] = useLoadingContext();

  const fetchDailyStatistics = async () => {
    setLoading(true);

    const response = await axios.get(`/api/statistics/get-daily`);

    setData(response.data.data);

    setLoading(false);
  };

  useEffect(() => {
    fetchDailyStatistics();
  }, []);

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
        text: 'Weekly summarize',
        align: 'center',
        style: {
          fontSize: '24px',
          fontWeight: 'bold'
        }
      }
    }
  };

  const lineChartOptions = {
    series,
    options: {
      chart: {
        height: 480,
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
        }
      },
      colors: chartColors,
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: 'Weekly summarize',
        align: 'center',
        style: {
          fontSize: '24px',
          fontWeight: 'bold'
        }
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      markers: {
        size: 1
      },
      xaxis: { categories: chartCategories },
      yaxis: {
        title: {
          text: 'User Balance (VND)'
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    }
  };

  useEffect(() => {
    const rawData = Array.from({ length: dayCount }, (_, i) => {
      if ([1, 2].includes(spendingType)) {
        return data
          .filter(
            (item) =>
              [1, 2].includes(item.category_type) &&
              item.spending_type === spendingType &&
              moment(item.created_at)
                .subtract(1, 'day')
                .format('DD/MM/YYYY') ===
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
      } else {
        return +data.filter(
          (item) =>
            item.spending_type === spendingType &&
            moment(item.created_at).subtract(1, 'day').format('DD/MM/YYYY') ===
              moment(endDate).subtract(i, 'day').format('DD/MM/YYYY')
        )[0]?.amount?.$numberDecimal;
      }
    }).reverse();

    const categoriesList = getUniqueNames(
      rawData.reduce((a, b) => a.concat(b), [])
    );
    if ([1, 2].includes(spendingType)) {
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
    } else {
      setSeries([
        {
          name: 'User Balance',
          data: rawData
        }
      ]);
    }

    setChartCategories(
      Array.from({ length: dayCount }, (_, i) =>
        moment(endDate).subtract(i, 'day').format('DD/MM/YYYY')
      ).reverse()
    );
  }, [spendingType, endDate]);

  return data.length == 0 ? (
    <>
      <Typography>No data</Typography>
    </>
  ) : (
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
              <MenuItem value={3}>User Balance</MenuItem>
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
        {[1, 2].includes(spendingType) && (
          <Chart
            options={chartOptions.options}
            series={chartOptions.series}
            type="bar"
            height={480}
            width="100%"
          />
        )}
        {spendingType === 3 && (
          <Chart
            options={lineChartOptions.options}
            series={lineChartOptions.series}
            type="line"
            height={480}
            width="100%"
          />
        )}
      </Box>
    </>
  );
};

export default Weekly;
