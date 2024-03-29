import { Box, Grid, Tab, Tabs } from '@mui/material';
import classNames from 'classnames';
import Head from 'next/head';
import { useState } from 'react';
import Daily from '../../components/Daily';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Monthly from '../../components/Monthly';
import Sidebar from '../../components/Sidebar';
import Weekly from '../../components/Weekly';
import styles from './Charts.module.scss';

export const chartColors = [
  '#FF0000',
  '#FF8E00',
  '#FFD700',
  '#008E00',
  '#00C0C0',
  '#400098',
  '#8E008E',
  '#FEB019'
];

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

export default function Charts() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Head>
        <title>Charts</title>
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
                  label="Monthly"
                  {...a11yProps(2)}
                />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Daily />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Weekly />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Monthly />
            </TabPanel>
          </Box>
        </Grid>
      </main>
      <Footer sx={{ background: '#808080' }}></Footer>
    </>
  );
}
