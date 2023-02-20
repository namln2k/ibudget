import { Grid } from '@mui/material';
import axios from 'axios';
import classNames from 'classnames';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import FullScreenLoader from '../../components/FullScreenLoader';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useLoadingContext } from '../../contexts/loading';
import { useUserContext } from '../../contexts/user';
import styles from './Charts.module.scss';

export default function Categories(props) {
  const [dailyStatistics, setDailyStatistics] = useState([]);

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
        <FullScreenLoader open={loading}></FullScreenLoader>
        <Grid className={classNames(styles.content)}>
          {dailyStatistics.map((record) => (
            <Grid key={record._id}>{record._id}</Grid>
          ))}
        </Grid>
      </main>
      <Footer sx={{ background: '#808080' }}></Footer>
    </>
  );
}
