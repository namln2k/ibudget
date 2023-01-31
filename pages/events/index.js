import { Grid } from '@mui/material';
import axios from 'axios';
import classNames from 'classnames';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import ConfirmDialog from '../../components/ConfirmDialog';
import Footer from '../../components/Footer';
import FullScreenLoader from '../../components/FullScreenLoader';
import Header from '../../components/Header';
import MessageDialog from '../../components/MessageDialog';
import Sidebar from '../../components/Sidebar';
import { useLoadingContext } from '../../contexts/loading';
import { useUserContext } from '../../contexts/user';
import styles from './Events.module.scss';

export default function Categories(props) {
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useLoadingContext();

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const [user, setUser] = useUserContext();

  useEffect(() => {
    let timeoutId;

    if (successMessage != '') {
      setErrorMessage('');
      timeoutId = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [successMessage]);

  useEffect(() => {
    let timeoutId;

    if (errorMessage != '') {
      timeoutId = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [errorMessage]);

  const persistUserAndGetEvents = async () => {
    setLoading(true);
    if (!!user) {
      const response = await axios.post('/api/auth/persist-user');
      const responseData = response.data;

      if (responseData.statusCode === 200) {
        setUser(responseData.data);

        const response = await axios.get(
          `/api/events/get?userId=${responseData.data._id}&role=participant`
        );

        setEvents(response.data.data);
      }
    } else {
      const response = await axios.get(
        `/api/events/get?userId=${user._id}&role=participant`
      );

      setEvents(response.data.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    persistUserAndGetEvents();
  }, []);

  return (
    <>
      <Head>
        <title>Categories</title>
      </Head>
      <Header></Header>
      <main className={classNames(styles.main)}>
        <Sidebar></Sidebar>
        <FullScreenLoader open={loading}></FullScreenLoader>
        <MessageDialog type="error" open={errorMessage != ''}>
          {errorMessage}
        </MessageDialog>
        <MessageDialog type="success" open={successMessage != ''}>
          {successMessage}
        </MessageDialog>
        <ConfirmDialog
          title="Are you sure?"
          content="Please make sure you want to delete the category(s)!"
          isOpen={isConfirmDialogOpen}
          handleConfirm={() => {
            handleDelete();
            setIsConfirmDialogOpen(false);
            setIsDialogOpen(false);
            closeContextMenu();
          }}
          handleClose={() => {
            setIsConfirmDialogOpen(false);
            closeContextMenu();
          }}
        ></ConfirmDialog>
        <Grid className={classNames(styles.content)}>
          <form onSubmit={(event) => handleSubmit(event)}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" />
            <label htmlFor="holder_id">Holder</label>
            <input type="text" id="holder_id" />
            <label htmlFor="split_rule">Split rule</label>
            <input type="text" id="split_rule" />
            <button type="submit">Submit</button>
          </form>
        </Grid>
      </main>
      <Footer sx={{ background: '#808080' }}></Footer>
    </>
  );
}
