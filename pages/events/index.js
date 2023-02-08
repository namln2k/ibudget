import { Grid, Menu, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
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

const columns = [
  { field: 'index', headerName: 'Index', width: 80 },
  { field: 'name', headerName: 'Event name', width: 320 },
  { field: 'description', headerName: 'Description', width: 480 },
  { field: 'no_of_users', headerName: 'Number of users', width: 180 },
  { field: 'total', headerName: 'Total budget', width: 200 },
  { field: 'due_date', headerName: 'Due date', width: 240 }
];

export default function Categories(props) {
  const [events, setEvents] = useState([]);

  const [selectedEvents, setSelectedEvents] = useState([]);

  const [contextMenu, setContextMenu] = useState(null);

  const [selectedEventId, setSelectedEventId] = useState();

  const [loading, setLoading] = useLoadingContext();

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const [user, setUser] = useUserContext();

  const handleContextMenu = (event) => {
    event.preventDefault();
    setSelectedEventId(event.currentTarget.getAttribute('data-id'));
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null
    );
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

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
        <title>Events</title>
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
          content="Please make sure you want to unjoin the event(s)!"
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
          <DataGrid
            rows={events}
            componentsProps={{
              row: {
                onContextMenu: handleContextMenu
              }
            }}
            columns={columns}
            checkboxSelection
            onSelectionModelChange={(ids) => {
              const selectedIds = new Set(ids);
              const selectedRows = events
                .filter((event) => selectedIds.has(event._id))
                .map((event) => event._id);

              setSelectedEvents(selectedRows);
            }}
          />
          <Menu
            open={contextMenu !== null}
            onClose={closeContextMenu}
            anchorReference="anchorPosition"
            anchorPosition={
              contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined
            }
            componentsProps={{
              root: {
                onContextMenu: (e) => {
                  e.preventDefault();
                  handleClose();
                }
              }
            }}
          >
            <MenuItem>Edit</MenuItem>
            <MenuItem>Delete</MenuItem>
          </Menu>
        </Grid>
      </main>
      <Footer sx={{ background: '#808080' }}></Footer>
    </>
  );
}
