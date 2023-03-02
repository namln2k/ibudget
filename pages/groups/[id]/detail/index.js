import {
  Button,
  Grid,
  Menu,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import classNames from 'classnames';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Footer from '../../../../components/Footer';
import FormDialog from '../../../../components/FormDialog';
import Header from '../../../../components/Header';
import MessageDialog from '../../../../components/MessageDialog';
import Sidebar from '../../../../components/Sidebar';
import { useLoadingContext } from '../../../../contexts/loading';
import { useUserContext } from '../../../../contexts/user';
import * as groupHelper from '../../../../helpers/group';
import {
  BOTH_VERIFIED,
  HOLDER_ACCEPT,
  HOLDER_REQUEST,
  PARTICIPANT_ACCEPT,
  PARTICIPANT_REQUEST,
  SELF_VERIFY
} from '../../../../helpers/group';
import * as utilHelper from '../../../../helpers/util';
import styles from './Detail.module.scss';

const columns = [
  { field: 'index', headerName: 'Index', width: 60 },
  { field: 'group_id', headerName: 'Group ID', width: 280 },
  { field: 'user_name', headerName: 'Username', width: 240 },
  { field: 'group_name', headerName: 'Group name', width: 300 },
  { field: 'amount_paid_display', headerName: 'Currently paid', width: 160 },
  {
    field: 'amount_to_pay_display',
    headerName: 'Expected to pay',
    width: 160
  },
  { field: 'verified_display', headerName: 'Verification status', width: 180 },
  { field: 'due_date_display', headerName: 'Due date', width: 180 }
];

const formatGroupDataForDisplay = (detail) => {
  detail.amount_paid_display = detail.amount_paid.$numberDecimal
    ? utilHelper.formatCurrency(detail.amount_paid.$numberDecimal)
    : utilHelper.formatCurrency(0);

  detail.amount_to_pay_display = detail.amount_to_pay
    ? utilHelper.formatCurrency(detail.amount_to_pay.$numberDecimal)
    : utilHelper.formatCurrency(0);

  detail.due_date_display = utilHelper.formatDate(
    detail.group_due_date,
    'DD-MM-YYYY'
  );

  detail.verified_display =
    detail.verified === BOTH_VERIFIED ? 'Verified' : 'Pending';

  return detail;
};

export default function Categories(props) {
  const [details, setDetails] = useState([]);

  const [loading, setLoading] = useLoadingContext();

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);

  const [contextMenu, setContextMenu] = useState(null);

  const [selectedDetailId, setSelectedDetailId] = useState();

  const [successMessage, setSuccessMessage] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const [editMode, setEditMode] = useState();

  const [detailToSubmit, setDetailToSubmit] = useState({});

  const [user, setUser] = useUserContext();

  const router = useRouter();

  const handleContextMenu = (event) => {
    event.preventDefault();
    setSelectedDetailId(event.currentTarget.getAttribute('data-id'));
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null
    );
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const submitDetailChanges = async () => {
    setLoading(true);

    const response = await axios.post(
      `/api/groups/detail/${detailToSubmit._id}/edit`,
      detailToSubmit
    );
    const responseData = response.data;

    setLoading(false);

    if (responseData.statusCode === 200) {
      setSuccessMessage('Your changes have been submitted!');
      fetchDetails();
    } else {
      setErrorMessage(responseData.error);
    }

    setIsFormDialogOpen(false);
  };

  const fetchDataForEditForm = async () => {
    setLoading(true);

    const response = await axios.get(`/api/groups/detail/${selectedDetailId}`);
    const responseData = response.data;

    setLoading(false);

    if (responseData.statusCode === 200) {
      const detail = responseData.data;

      setEditMode(groupHelper.getEditMode(user._id, detail));
      setDetailToSubmit(detail);
      setIsFormDialogOpen(true);
    } else {
      setErrorMessage(responseData.error.toString());
    }
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

  const fetchDetails = async () => {
    if (router.query.id) {
      const response = await axios.get(`/api/groups/${router.query.id}/detail`);
      const responseData = response.data;

      setLoading(false);

      if (responseData.statusCode === 200) {
        setDetails(responseData.data);
      } else {
        setErrorMessage('Some errors happened');
      }
    }
  };

  const persistUser = async () => {
    if (!!user) {
      setLoading(true);

      const response = await axios.post(`/api/auth/persist-user`);
      const responseData = response.data;

      if (responseData.statusCode === 200) {
        setUser(responseData.data);
      } else {
        setErrorMessage('Unspecified errors happened!');
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    persistUser();
  }, [router.query]);

  return (
    <>
      <Head>
        <title>Group detail</title>
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
          title="Manage payments"
          isOpen={isFormDialogOpen}
          handleClose={() => {
            setIsFormDialogOpen(false);
          }}
          hideSubmitButton
          form={
            <Grid className={classNames(styles.formEditDetail)}>
              <TextField
                label="Currently paid"
                defaultValue={detailToSubmit?.amount_paid?.$numberDecimal}
                onChange={(event) => {
                  setDetailToSubmit({
                    ...detailToSubmit,
                    amount_paid: { $numberDecimal: event.target.value }
                  });
                }}
                InputProps={{
                  readOnly:
                    editMode === HOLDER_ACCEPT ||
                    editMode === PARTICIPANT_ACCEPT
                }}
                variant={
                  editMode === HOLDER_ACCEPT || editMode === PARTICIPANT_ACCEPT
                    ? 'filled'
                    : 'standard'
                }
              />
              <TextField
                label="Expected to pay"
                defaultValue={detailToSubmit?.amount_to_pay?.$numberDecimal}
                onChange={(event) => {
                  setDetailToSubmit({
                    ...detailToSubmit,
                    amount_to_pay: { $numberDecimal: event.target.value }
                  });
                }}
                InputProps={{
                  readOnly:
                    editMode === HOLDER_ACCEPT ||
                    editMode === PARTICIPANT_ACCEPT
                }}
                variant={
                  editMode === HOLDER_ACCEPT || editMode === PARTICIPANT_ACCEPT
                    ? 'filled'
                    : 'standard'
                }
              />
              <Button
                type="submit"
                variant="contained"
                color="success"
                onClick={submitDetailChanges}
              >
                {editMode === HOLDER_REQUEST ||
                editMode === PARTICIPANT_REQUEST ||
                editMode === SELF_VERIFY
                  ? 'Request changes'
                  : 'Approve'}
              </Button>
            </Grid>
          }
        ></FormDialog>
        <Grid className={classNames(styles.content)}>
          <Button
            sx={{
              fontWeight: 700,
              marginBottom: '20px'
            }}
            variant="outlined"
            color="warning"
            onClick={() => {
              router.push('/groups');
            }}
          >
            Back to Groups
          </Button>
          <Typography
            sx={{
              fontStyle: 'italic',
              fontWeight: 700,
              marginBottom: '8px',
              marginRight: 0,
              float: 'right'
            }}
          >
            Note: Right click to manage
          </Typography>
          <DataGrid
            rows={details.map((detail) => formatGroupDataForDisplay(detail))}
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
                  setContextMenu();
                }
              }
            }}
          >
            <MenuItem
              onClick={() => {
                fetchDataForEditForm();
                closeContextMenu();
              }}
            >
              Manage
            </MenuItem>
          </Menu>
        </Grid>
      </main>
      <Footer sx={{ background: '#808080' }}></Footer>
    </>
  );
}
