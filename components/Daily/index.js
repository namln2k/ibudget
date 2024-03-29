import { Stack, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
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

const Daily = () => {
  const [data, setData] = useState([]);
  const [spendingType, setSpendingType] = useState(2);
  const [chartType, setChartType] = useState('bar');
  const [renderData, setRenderData] = useState([]);
  const [userBalance, setUserBalance] = useState('0');
  const [date, setDate] = useState(moment(new Date()).subtract(1, 'day'));
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

  const handleChangeDate = (newValue) => {
    setDate(newValue);
  };

  const barOptions = {
    series: [
      {
        name: 'amount',
        data: renderData.map((item) => item.data)
      }
    ],
    options: {
      chart: {
        height: 350,
        type: 'bar',
        toolbar: {
          show: false
        }
      },
      colors: chartColors,
      plotOptions: {
        bar: {
          // borderRadius: 10,
          columnWidth: '45%',
          distributed: true,
          dataLabels: {
            position: 'top'
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => formatCurrency(val),
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#000']
        }
      },
      legend: {
        show: false
      },
      xaxis: {
        categories: renderData.map((item) => item.name),
        labels: {
          style: {
            colors: chartColors,
            fontSize: '14px'
          }
        }
      },
      yaxis: {
        title: {
          text: 'VND'
        }
      },
      tooltip: {
        y: {
          formatter: (val) => formatCurrency(val)
        }
      },
      title: {
        text: 'Daily summarize',
        align: 'center',
        style: {
          fontSize: '24px',
          fontWeight: 'bold'
        }
      }
    }
  };

  const donutOptions = {
    series: renderData.map((item) => item.data),
    options: {
      chart: {
        width: 380,
        type: 'donut'
      },
      labels: renderData.map((item) => item.name),
      colors: chartColors,
      dataLabels: {
        enabled: true,
        formatter: (val) => val.toFixed(2) + ' %',
        style: {
          fontSize: '12px',
          colors: ['#fff'],
          textShadow: 'none'
        }
      },
      fill: {
        type: 'gradient'
      },
      legend: {
        formatter: function (val, opts) {
          return (
            val +
            ' - ' +
            formatCurrency(opts.w.globals.series[opts.seriesIndex])
          );
        }
      },
      tooltip: {
        y: {
          formatter: (val) => formatCurrency(val)
        }
      },
      title: {
        text: 'Daily summarize',
        align: 'center',
        style: {
          fontSize: '24px',
          fontWeight: 'bold'
        }
      }
    }
  };

  const handleChangeSpending = (e) => {
    setSpendingType(e.target.value);
  };

  const handleChangeChart = (e) => {
    setChartType(e.target.value);
  };

  useEffect(() => {
    setRenderData(
      data
        .filter(
          (item) =>
            [1, 2].includes(item.category_type) &&
            item.spending_type === spendingType &&
            moment(item.created_at).subtract(1, 'day').format('DD/MM/YYYY') ===
              date.format('DD/MM/YYYY')
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
        .sort((a, b) => (a.name > b.name ? 1 : -1))
    );

    setUserBalance(
      data.find(
        (item) =>
          item.spending_type === 3 &&
          moment(item.created_at).subtract(1, 'day').format('DD/MM/YYYY') ===
            date.format('DD/MM/YYYY')
      )
    );
  }, [data, spendingType, date]);

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
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 120 }}>
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel id="chart">Chart Type</InputLabel>
            <Select
              labelId="chart"
              id="select-chart"
              value={chartType}
              label="Chart Type"
              onChange={handleChangeChart}
            >
              <MenuItem value={'bar'}>Column</MenuItem>
              <MenuItem value={'donut'}>Donut</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 120 }}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DesktopDatePicker
              label="Date"
              inputFormat="DD/MM/YYYY"
              value={date}
              onChange={handleChangeDate}
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
        {renderData.length === 0 && (
          <Typography
            variant="h6"
            minHeight={350}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            No chart data
          </Typography>
        )}
        {chartType === 'bar' && renderData.length ? (
          <Chart
            options={barOptions.options}
            series={barOptions.series}
            type="bar"
            height={380}
            width="100%"
          />
        ) : null}
        {chartType === 'donut' && renderData.length ? (
          <Chart
            options={donutOptions.options}
            series={donutOptions.series}
            type="donut"
            height={380}
            width="100%"
          />
        ) : null}

        <Typography variant="h6" sx={{ mt: 2 }}>
          User balance:{' '}
          {userBalance?.amount?.$numberDecimal
            ? formatCurrency(userBalance?.amount?.$numberDecimal)
            : 'No data'}
        </Typography>
      </Box>
    </>
  );
};

export default Daily;
