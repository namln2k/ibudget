import { Stack, TextField } from '@mui/material';
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

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false
});

const colors = [
  '#FF0000',
  '#FF8E00',
  '#FFD700',
  '#008E00',
  '#00C0C0',
  '#400098',
  '#8E008E'
];

const Daily = ({ data }) => {
  const [spendingType, setSpendingType] = useState(2);
  const [chartType, setChartType] = useState('bar');
  const [renderData, setRenderData] = useState([]);
  const [date, setDate] = useState(moment(new Date()).subtract(1, 'day'));

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
      colors,
      plotOptions: {
        bar: {
          borderRadius: 10,
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
            colors,
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
      colors,
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
          return val + ' - ' + opts.w.globals.series[opts.seriesIndex];
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
              data: Number(item.amount.$numberDecimal),
              name: item.category_id.name
            };
          } else {
            return {
              data: Number(item.amount.$numberDecimal),
              name: 'Other'
            };
          }
        })
    );
  }, [spendingType, date]);

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
              <MenuItem value={3}>User balance</MenuItem>
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
        {chartType === 'bar' && (
          <ReactApexChart
            options={barOptions.options}
            series={barOptions.series}
            type="bar"
            height={380}
            width="100%"
          />
        )}
        {chartType === 'donut' && (
          <ReactApexChart
            options={donutOptions.options}
            series={donutOptions.series}
            type="donut"
            height={380}
            width="100%"
          />
        )}
      </Box>
    </>
  );
};

export default Daily;
