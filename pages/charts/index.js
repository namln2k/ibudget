import { Box, Grid, Tab, Tabs } from '@mui/material';
import axios from 'axios';
import classNames from 'classnames';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Daily from '../../components/Daily';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useLoadingContext } from '../../contexts/loading';
import { useUserContext } from '../../contexts/user';
import styles from './Charts.module.scss';
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index) => {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`
  };
};

export default function Categories(props) {
  const [dailyStatistics, setDailyStatistics] = useState([]);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [loading, setLoading] = useLoadingContext();

  const [user, setUser] = useUserContext();

  const persistUserAndGetStatistics = async () => {
    setLoading(true);
    if (!!user) {
      const response = await axios.post('/api/auth/persist-user');
      const responseData = response.data;

      if (responseData.statusCode === 200) {
        setUser(responseData.data);

        const response = await axios.get(
          `/api/statistics/get-daily?userId=${responseData.data._id}`
        );

        setDailyStatistics(response.data.data);
      }
    } else {
      const response = await axios.get(
        `/api/statistics/get-daily?userId=${user._id}`
      );

      setDailyStatistics(response.data.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    persistUserAndGetStatistics();
  }, []);

  return (
    <>
      <Head>
        <title>Charts(Trends)</title>
      </Head>
      <Header></Header>
      <main className={classNames(styles.main)}>
        <Sidebar></Sidebar>
        <Grid className={classNames(styles.content)}>
          <Box sx={{ width: '100wh', p: 5 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab
                  className={classNames(styles.tab)}
                  label="Daily"
                  {...a11yProps(0)}
                />
                <Tab
                  className={classNames(styles.tab)}
                  label="Weekly"
                  {...a11yProps(1)}
                />
                <Tab
                  className={classNames(styles.tab)}
                  label="Month"
                  {...a11yProps(2)}
                />
                <Tab
                  className={classNames(styles.tab)}
                  label="Year"
                  {...a11yProps(3)}
                />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Daily data={dailyStatistics} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              Weekly
            </TabPanel>
            <TabPanel value={value} index={2}>
              Monthly
            </TabPanel>
            <TabPanel value={value} index={3}>
              Yearly
            </TabPanel>
          </Box>
        </Grid>
      </main>
      <Footer sx={{ background: '#808080' }}></Footer>
    </>
  );
}
