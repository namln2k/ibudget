import {
  FormControl,
  Grid,
  Input,
  InputLabel,
  Menu,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import classNames from 'classnames';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ConfirmDialog from '../../components/ConfirmDialog';
import Footer from '../../components/Footer';
import FormDialog from '../../components/FormDialog';
import Header from '../../components/Header';
import MessageDialog from '../../components/MessageDialog';
import Sidebar from '../../components/Sidebar';
import { useLoadingContext } from '../../contexts/loading';
import * as utilHelper from '../../helpers/util';
import styles from './Groups.module.scss';

const columns = [
  { field: 'index', headerName: 'Index', minWidth: 60 },
  { field: 'id', headerName: 'Group ID', minWidth: 280 },
  { field: 'name', headerName: 'Group name', minWidth: 240 },
  { field: 'description', headerName: 'Description', minWidth: 300 },
  { field: 'role', headerName: 'Role', width: 160 },
  { field: 'due_date_display', headerName: 'Due date', width: 160 },
  { field: 'budget_display', headerName: 'Current budget', width: 160 },
  {
    field: 'expected_budget_display',
    headerName: 'Expected budget',
    width: 180
  }
];

const formatGroupDataForDisplay = (group) => {
  group.budget_display = group.budget
    ? utilHelper.formatCurrency(group.budget)
    : utilHelper.formatCurrency(0);

  group.expected_budget_display = group.expected_budget
    ? utilHelper.formatCurrency(group.expected_budget)
    : utilHelper.formatCurrency(0);

  group.due_date_display = utilHelper.formatDate(group.due_date, 'DD-MM-YYYY');

  return group;
};

export default function Groups(props) {
  const [groups, setGroups] = useState([]);

  const [loading, setLoading] = useLoadingContext();

  const [successMessage, setSuccessMessage] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const [contextMenu, setContextMenu] = useState(null);

  const [isFormJoinOpen, setIsFormJoinOpen] = useState(false);

  const [groupIdToJoin, setGroupIdToJoin] = useState();

  const [isFormInfoOpen, setIsFormInfoOpen] = useState(false);

  const [groupToSubmit, setGroupToSubmit] = useState({ due_date: new Date() });

  const [selectedGroupId, setSelectedGroupId] = useState();

  const [isEdit, setIsEdit] = useState(false);

  const router = useRouter();

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

  const fetchGroups = async () => {
    const response = await axios.get(`/api/groups/get`);
    const responseData = response.data;

    if (responseData.statusCode === 200) {
      setGroups(responseData.data);
    } else {
      setErrorMessage(responseData.error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleContextMenu = (event) => {
    event.preventDefault();
    setSelectedGroupId(event.currentTarget.getAttribute('data-id'));
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null
    );
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const viewGroup = () => {
    closeContextMenu();
    router.push(`groups/${selectedGroupId}/detail`);
  };

  const viewFormGroupInfo = async () => {
    setContextMenu(null);
    setLoading(true);
    setIsEdit(true);

    const response = await axios.get(`/api/groups/${selectedGroupId}/info`);
    const responseData = response.data;

    setLoading(false);

    if (responseData.statusCode === 200) {
      setGroupToSubmit(responseData.data);
      setIsFormInfoOpen(true);
    } else {
      setErrorMessage(responseData.error.toString());
    }
  };

  const joinGroup = async () => {
    setLoading(true);

    const response = await axios.post(`api/groups/${groupIdToJoin}/join`);
    const responseData = response.data;

    setLoading(false);

    if (responseData.statusCode === 200) {
      setSuccessMessage('You have joined a new group!');
      setGroupIdToJoin();
      closeFormJoin();
      fetchGroups();
    } else {
      setErrorMessage(responseData.error.toString());
    }

    fetchGroups();
  };

  const closeFormJoin = () => {
    setGroupIdToJoin();
    setIsFormJoinOpen(false);
  };

  const submitFormGroupInfo = async () => {
    setLoading(true);
    if (!isEdit) {
      const response = await axios.post(`api/groups/add`, groupToSubmit);
      setLoading(false);

      if (response.data?.statusCode === 200) {
        setSuccessMessage('You have created a new group');
        setGroupToSubmit({ due_date: new Date() });
        closeFormGroupInfo();
        fetchGroups();
      }
    } else {
      const response = await axios.post(
        `api/groups/${selectedGroupId}/edit`,
        groupToSubmit
      );
      setLoading(false);

      if (response.data?.statusCode === 200) {
        setSuccessMessage('Your changes have been submitted');
        closeFormGroupInfo();
        fetchGroups();
      }
    }
  };

  const closeFormGroupInfo = () => {
    setIsFormInfoOpen(false);
  };

  const processToLeaveGroup = async () => {
    setLoading(true);

    const response = await axios.post(`api/groups/${selectedGroupId}/leave`);
    const responseData = response.data;

    setLoading(false);

    if (responseData.statusCode === 200) {
      setSuccessMessage('You have left this group. All your data is deleted.');
    } else {
      setErrorMessage(responseData?.error.toString());
    }

    fetchGroups();
  };

  const leaveGroup = async () => {
    setLoading(true);
    setContextMenu(null);

    const response = await axios.get(`api/groups/${selectedGroupId}/can-leave`);
    const responseData = response.data;

    setLoading(false);

    if (responseData?.statusCode === 200) {
      if (responseData.data) {
        setIsConfirmDialogOpen(true);
      } else {
        setErrorMessage(
          'Can not leave this group right now. You must either pay your part or wait for all others to complete theirs.'
        );
      }
    } else {
      setErrorMessage(response?.data.error.toString());
    }
  };

  return (
    <>
      <Head>
        <title>Groups</title>
      </Head>
      <Header></Header>
      <main className={classNames(styles.main)}>
        <Sidebar></Sidebar>
        <MessageDialog type="error" open={errorMessage != ''}>
          {errorMessage}
        </MessageDialog>
        <MessageDialog type="success" open={successMessage != ''}>
          {successMessage}
        </MessageDialog>
        <FormDialog
          title="Join a group"
          contentText="Please fill in required fields"
          isOpen={isFormJoinOpen}
          form={
            <>
              <FormControl
                fullWidth
                required
                variant="standard"
                className={classNames(styles.formControl)}
              >
                <InputLabel htmlFor="group-id">Group ID</InputLabel>
                <Input
                  id="group-id"
                  value={groupIdToJoin || ''}
                  onChange={(e) => setGroupIdToJoin(e.target.value)}
                />
              </FormControl>
            </>
          }
          handleConfirm={joinGroup}
          handleClose={closeFormJoin}
        ></FormDialog>
        <FormDialog
          title="Create a new group"
          contentText="Please fill in required fields"
          isOpen={isFormInfoOpen}
          form={
            <>
              <FormControl
                fullWidth
                required
                variant="standard"
                className={classNames(styles.formControl)}
              >
                <InputLabel htmlFor="group-name">Group name</InputLabel>
                <Input
                  id="group-name"
                  value={groupToSubmit.name || ''}
                  onChange={(e) =>
                    setGroupToSubmit({ ...groupToSubmit, name: e.target.value })
                  }
                />
              </FormControl>
              <FormControl
                fullWidth
                required
                variant="standard"
                className={classNames(styles.formControl)}
              >
                <InputLabel htmlFor="group-description">
                  Group description
                </InputLabel>
                <Input
                  id="group-description"
                  value={groupToSubmit.description || ''}
                  onChange={(e) =>
                    setGroupToSubmit({
                      ...groupToSubmit,
                      description: e.target.value
                    })
                  }
                />
              </FormControl>
              <FormControl
                fullWidth
                required
                variant="standard"
                className={classNames(styles.formControl)}
              >
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DesktopDatePicker
                    label="Due date"
                    inputFormat="DD/MM/YYYY"
                    value={groupToSubmit.due_date}
                    onChange={(newValue) =>
                      setGroupToSubmit({ ...groupToSubmit, due_date: newValue })
                    }
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </FormControl>
            </>
          }
          handleConfirm={submitFormGroupInfo}
          handleClose={closeFormGroupInfo}
        ></FormDialog>
        <ConfirmDialog
          title="Are you sure?"
          content="Please make sure you want to leave! (All your data would be deleted)"
          isOpen={isConfirmDialogOpen}
          handleConfirm={() => {
            processToLeaveGroup();
            setIsConfirmDialogOpen(false);
          }}
          handleClose={() => {
            setIsConfirmDialogOpen(false);
          }}
        ></ConfirmDialog>
        <Grid className={classNames(styles.content)}>
          <Grid className={classNames(styles.actions)}>
            <Grid
              className={classNames(styles.btn, styles.btnAdd)}
              onClick={() => {
                setIsFormJoinOpen(true);
              }}
            >
              <Typography variant="h6">Join a group</Typography>
            </Grid>
            <Grid
              className={classNames(styles.btn, styles.btnAdd)}
              onClick={() => {
                setIsFormInfoOpen(true);
                setIsEdit(false);
              }}
            >
              <Typography variant="h6">Create a new group</Typography>
            </Grid>
          </Grid>
          <Typography
            sx={{
              fontStyle: 'italic',
              fontWeight: 700,
              marginBottom: '8px',
              marginRight: 0
            }}
          >
            Note: Right click for actions
          </Typography>
          <DataGrid
            rows={groups.map((group) => formatGroupDataForDisplay(group))}
            componentsProps={{
              row: {
                onContextMenu: handleContextMenu
              }
            }}
            columns={columns}
            checkboxSelection={false}
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
            <MenuItem onClick={viewFormGroupInfo}>Edit general detail</MenuItem>
            <MenuItem onClick={viewGroup}>View detail</MenuItem>
            <MenuItem onClick={leaveGroup}>Leave</MenuItem>
          </Menu>
        </Grid>
      </main>
      <Footer sx={{ background: '#808080' }}></Footer>
    </>
  );
}
