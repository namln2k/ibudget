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

const Monthly = () => {
  const [data, setData] = useState([]);
  const [fullMonthData, setFullMonthData] = useState([]);
  const [fullMonthRender, setFullMonthRender] = useState([]);
  const [chartCategories, setChartCategories] = useState([]);
  const [spendingType, setSpendingType] = useState(2);
  const [chartType, setChartType] = useState('bar');
  const [renderData, setRenderData] = useState([]);
  const [userBalance, setUserBalance] = useState('0');
  const [month, setMonth] = useState(moment(new Date()).subtract(1, 'month'));
  const [loading, setLoading] = useLoadingContext();

  const fetchMonthlyStatistics = async () => {
    setLoading(true);

    const response = await axios.get(`/api/statistics/get-monthly`);

    setData(response.data.data);

    const fullMonthResponse = await axios.get(`/api/statistics/get-daily`);

    setFullMonthData(fullMonthResponse.data.data);

    setLoading(false);
  };

  useEffect(() => {
    fetchMonthlyStatistics();
  }, []);

  const handleChangeDate = (newValue) => {
    setMonth(newValue);
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
        data: renderData.map((item) => ({
          x: item.name,
          y: item.data,
          goals: [
            {
              name: 'Monthly Target',
              value: item.target,
              strokeHeight: 5,
              strokeColor: chartColors[6]
            }
          ]
        }))
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
      title: {
        text: 'Monthly summarize',
        align: 'center',
        style: {
          fontSize: '24px',
          fontWeight: 'bold'
        }
      },
      plotOptions: {
        bar: {
          columnWidth: '60%'
        }
      },
      colors: chartColors,
      dataLabels: {
        enabled: false
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        customLegendItems: ['Actual', 'Expected'],
        markers: {
          fillColors: ['#FF0000', '#775DD0']
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
        text: 'Monthly summarize',
        align: 'center',
        style: {
          fontSize: '24px',
          fontWeight: 'bold'
        }
      }
    }
  };

  const lineChartOptions = {
    series: [
      {
        name: 'User Balance',
        data: fullMonthRender
      }
    ],
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
        text: 'Monthly summarize',
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
      xaxis: {
        categories: chartCategories
      },
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
    setRenderData(
      data
        .filter(
          (item) =>
            item.category_type === 2 &&
            item.spending_type === spendingType &&
            moment(item.created_at).subtract(1, 'day').format('MM/YYYY') ===
              month.format('MM/YYYY')
        )
        .map((item) => ({
          data: Math.abs(Number(item.amount.$numberDecimal)),
          name: item.category_id.name,
          target: Number(item.category_id.monthly_target.$numberDecimal)
        }))
        .sort((a, b) => (a.name > b.name ? 1 : -1))
    );
    setUserBalance(
      data.find(
        (item) =>
          item.spending_type === 3 &&
          moment(item.created_at).subtract(1, 'day').format('MM/YYYY') ===
            month.format('MM/YYYY')
      )
    );
    setFullMonthRender(
      Array.from({ length: moment(month).daysInMonth() }, (_, i) => {
        return (
          +fullMonthData.filter(
            (item) =>
              item.spending_type === 3 &&
              moment(item.created_at)
                .subtract(1, 'day')
                .format('DD/MM/YYYY') ===
                moment(month)
                  .startOf('month')
                  .add(i, 'day')
                  .format('DD/MM/YYYY')
          )[0]?.amount?.$numberDecimal || null
        );
      })
    );
    setChartCategories(
      Array.from({ length: moment(month).daysInMonth() }, (_, i) =>
        moment(month).startOf('month').add(i, 'day').format('DD/MM/YYYY')
      )
    );
  }, [data, spendingType, month, fullMonthData]);

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
              value={month}
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
        {[1, 2].includes(spendingType) && renderData.length === 0 && (
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
        {[1, 2].includes(spendingType) &&
        chartType === 'bar' &&
        renderData.length ? (
          <Chart
            options={barOptions.options}
            series={barOptions.series}
            type="bar"
            height={480}
            width="100%"
          />
        ) : null}
        {[1, 2].includes(spendingType) &&
        chartType === 'donut' &&
        renderData.length ? (
          <Chart
            options={donutOptions.options}
            series={donutOptions.series}
            type="donut"
            height={480}
            width="100%"
          />
        ) : null}
        {spendingType === 3 ? (
          <Chart
            options={lineChartOptions.options}
            series={lineChartOptions.series}
            type="line"
            height={480}
            width="100%"
          />
        ) : null}
      </Box>
    </>
  );
};

export default Monthly;
