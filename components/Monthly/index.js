import { Stack, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { formatCurrency } from '../../helpers/util';
import { chartColors } from '../../pages/charts';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false
});

const Monthly = ({ data }) => {
  const [spendingType, setSpendingType] = useState(2);
  const [chartType, setChartType] = useState('bar');
  const [renderData, setRenderData] = useState([]);
  const [userBalance, setUserBalance] = useState('0');
  const [date, setDate] = useState(moment(new Date()).subtract(1, 'month'));

  const handleChangeDate = (newValue) => {
    setDate(newValue);
  };

  const handleChangeSpending = (e) => {
    setSpendingType(e.target.value);
  };

  const handleChangeChart = (e) => {
    setChartType(e.target.value);
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
        text: 'Chart title',
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
    setRenderData([
      {
        name: 'Income',
        data: 10000000
      },
      {
        name: 'Income',
        data: 20000000
      },
      {
        name: 'Income',
        data: 30000000
      },
      {
        name: 'Income',
        data: 15000000
      },
      {
        name: 'Income',
        data: 12000000
      }
    ]);
    setUserBalance({ amount: { $numberDecimal: 12000000 } });
  }, [data, spendingType, date]);

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
              label="Month"
              views={['year', 'month']}
              inputFormat="MM/YYYY"
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

export default Monthly;
