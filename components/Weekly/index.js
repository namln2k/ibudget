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
  const [userBalances, setUserBalances] = useState([]);

  const handleChangeEndDate = (newValue) => {
    setEndDate(newValue);
  };

  const handleChangeSpending = (e) => {
    setSpendingType(e.target.value);
  };

  const chartOptions = {
    series: [
      ...series.map((item) => ({
        ...item,
        type: 'column'
      })),
      {
        name: 'User Balance',
        data: userBalances,
        type: 'line'
      }
    ],
    options: {
      chart: {
        height: 450,
        type: 'line',
        stacked: true,
        toolbar: {
          show: false
        }
      },
      colors: chartColors,
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [1, 1, 1, 1, 1, 1, 1, 4]
      },
      title: {
        text: 'Chart title',
        align: 'center',
        style: {
          fontSize: '24px',
          fontWeight: 'bold'
        }
      },
      plotOptions: {
        bar: {
          dataLabels: {
            total: {
              enabled: true,
              style: {
                fontSize: '13px',
                fontWeight: 900
              },
              formatter: (val) => formatCurrency(val)
            }
          }
        }
      },
      xaxis: {
        categories: chartCategories
      },
      yaxis: [
        {
          seriesName: series[0]?.name,
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: chartColors[0]
          },
          labels: {
            style: {
              colors: chartColors[0]
            },
            formatter: (val) => formatCurrency(val)
          },
          title: {
            text: 'Money by day (VND)',
            style: {
              color: chartColors[0],
              fontSize: '14px'
            }
          },
          tooltip: {
            enabled: true
          }
        },
        ...series.slice(0, series.length - 1).map(() => ({
          seriesName: series[0]?.name,
          show: false,
          labels: {
            formatter: (val) => formatCurrency(val)
          }
        })),
        {
          seriesName: 'User Balance',
          opposite: true,
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: chartColors.slice(-1)[0]
          },
          labels: {
            style: {
              colors: chartColors.slice(-1)
            },
            formatter: (val) => formatCurrency(val)
          },
          title: {
            text: 'User Balance (VND)',
            style: {
              color: chartColors.slice(-1)[0],
              fontSize: '14px'
            }
          }
        }
      ],
      tooltip: {
        fixed: {
          enabled: true,
          position: 'topRight',
          offsetY: 30,
          offsetX: 100
        }
      },
      legend: {
        horizontalAlign: 'left',
        offsetX: 40
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

    setUserBalances(
      Array.from({ length: dayCount }, (_, i) => {
        const found = data.find(
          (item) =>
            item.spending_type === 3 &&
            moment(item.created_at).subtract(1, 'day').format('DD/MM/YYYY') ===
              moment(endDate).subtract(i, 'day').format('DD/MM/YYYY')
        );
        if (found) {
          return Number(found.amount.$numberDecimal);
        }
        return 0;
      }).reverse()
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
          type="line"
          height={500}
          width="100%"
        />
      </Box>
    </>
  );
};

export default Weekly;
