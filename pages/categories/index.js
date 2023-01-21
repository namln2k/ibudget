import {
  Button,
  Grid,
  Menu,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import classNames from 'classnames';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import Footer from '../../components/Footer';
import FullScreenLoader from '../../components/FullScreenLoader';
import Header from '../../components/Header';
import MessageDialog from '../../components/MessageDialog';
import Sidebar from '../../components/Sidebar';
import { useLoadingContext } from '../../contexts/loading';
import { useUserContext } from '../../contexts/user';
import styles from './Categories.module.scss';

const columns = [
  { field: 'index', headerName: 'Index', width: 100 },
  { field: 'name', headerName: 'Category name', width: 320 },
  { field: 'description', headerName: 'Description', width: 560 }
];

const renderField = (title, input) => {
  return (
    <tr>
      <td className={classNames(styles.inputField)}>
        <Typography sx={{ marginRight: '20px', verticalAlign: 'middle' }}>
          {title}:
        </Typography>
      </td>
      <td className={classNames(styles.inputField)}>{input}</td>
    </tr>
  );
};

export default function Categories(props) {
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useLoadingContext();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState();

  const [contextMenu, setContextMenu] = useState(null);

  const [category, setCategory] = useState({});

  const [isEdit, setIsEdit] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const [user, setUser] = useUserContext();

  const openDialogAddCate = () => {
    setCategory({
      name: '',
      description: ''
    });
    setIsEdit(false);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    setSelectedCategoryId(event.currentTarget.getAttribute('data-id'));
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null
    );
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleEdit = async () => {
    setIsEdit(true);
    closeContextMenu();
    setLoading(true);

    const response = await axios.get(
      '/api/categories/get?id=' + selectedCategoryId
    );
    const responseData = response.data;

    if (responseData.statusCode === 400) {
      setErrorMessage('Category no longer exists!');
    } else {
      setCategory(responseData.data);
      setIsDialogOpen(true);
    }

    setLoading(false);
  };

  const handleDelete = () => {
    closeContextMenu();
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

  const handleKeyDown = async (event) => {
    if (event.keyCode === 13) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!category.name) {
      setErrorMessage('Category name is required! Please fill in!');
      return;
    }

    let response;

    if (isEdit) {
      const categoryToEdit = category;
      delete categoryToEdit._id;

      response = await axios.post(
        '/api/categories/edit?id=' + selectedCategoryId,
        categoryToEdit
      );
    } else {
      const categoryToAdd = category;

      if (categories.find((category) => category.name === categoryToAdd.name)) {
        setErrorMessage('Category name must be unique!');
        return;
      }

      categoryToAdd.userId = user._id;

      response = await axios.post('/api/categories/add', categoryToAdd);
    }

    const responseData = response.data;

    if (responseData.statusCode === 400) {
      setErrorMessage(responseData.error.toString());
    } else if (responseData.statusCode === 200) {
      setErrorMessage('');
      setSuccessMessage(
        'Category ' +
          (isEdit ? 'edited' : responseData.data.name + ' added') +
          ' successfully!'
      );
      setIsDialogOpen(false);
      setCategory({});
      persistUserAndGetCategories();
    } else {
      setErrorMessage('Something went wrong!');
    }
  };

  const deleteSelected = async () => {
    if (selectedCategoryIds.length === 0) {
      return;
    }

    setLoading(true);

    const response = await axios.get(
      `/api/categories/delete/?ids=${JSON.stringify(selectedCategoryIds)}`
    );
    const responseData = response.data;

    if (responseData.statusCode === 400) {
      setErrorMessage(responseData.error.toString());
    } else if (responseData.statusCode === 200) {
      const deletedCount = responseData.data.deletedCount;
      if (selectedCategoryIds.length != deletedCount) {
        setSuccessMessage('');
        setErrorMessage('Some categories may not have been deleted!');
      } else {
        setErrorMessage('');
        setSuccessMessage(
          `Deleted ${responseData.data.deletedCount} category(s)!`
        );
      }

      persistUserAndGetCategories();
    } else {
      setErrorMessage('Something went wrong!');
    }

    setLoading(false);
  };

  const persistUserAndGetCategories = async () => {
    setLoading(true);
    if (!!user) {
      const response = await axios.post('/api/auth/persist-user');
      const responseData = response.data;

      if (responseData.statusCode === 200) {
        setUser(responseData.data);

        const response = await axios.get(
          `/api/categories/get?userId=${responseData.data._id}`
        );

        setCategories(response.data.data);
      }
    } else {
      const response = await axios.get(
        `/api/categories/get?userId=${user._id}`
      );

      setCategories(response.data.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    persistUserAndGetCategories();
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
        <Grid className={classNames(styles.content)}>
          <Grid className={classNames(styles.actions)}>
            <Grid
              className={classNames(styles.btn, styles.btnDelete)}
              onClick={deleteSelected}
            >
              <Typography variant="h6">Delete selected</Typography>
            </Grid>
            <Grid
              className={classNames(styles.btn, styles.btnAdd)}
              onClick={openDialogAddCate}
            >
              <Typography variant="h6">Add a category</Typography>
            </Grid>
          </Grid>
          <Dialog
            open={isDialogOpen}
            onClose={handleClose}
            className={classNames(styles.dialog)}
            onKeyDown={handleKeyDown}
          >
            <DialogTitle variant="h6" sx={{ textAlign: 'center' }}>
              {isEdit ? 'Edit category' : 'Add a new category'}
            </DialogTitle>
            <DialogContent sx={{ padding: '40px 30px' }}>
              <Grid sx={{ marginTop: '20px' }}>
                <table>
                  <tbody>
                    {renderField(
                      'Category name',
                      <TextField
                        required
                        placeholder="Category name"
                        variant="standard"
                        value={category.name || ''}
                        onChange={(event) =>
                          setCategory({
                            ...category,
                            name: event.target.value
                          })
                        }
                        autoFocus
                        sx={{ width: '240px' }}
                      />
                    )}
                    {renderField(
                      'Description',
                      <TextField
                        placeholder="Description"
                        variant="standard"
                        value={category.description || ''}
                        onChange={(event) =>
                          setCategory({
                            ...category,
                            description: event.target.value
                          })
                        }
                        sx={{ width: '600px' }}
                      />
                    )}
                  </tbody>
                </table>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ padding: '0 30px 30px 40px' }}>
              <Button
                onClick={handleSubmit}
                type="submit"
                variant="contained"
                className={classNames(styles.btnSubmit)}
              >
                <Typography>Submit</Typography>
              </Button>
              <Button onClick={handleClose}>
                <Typography>Cancel</Typography>
              </Button>
            </DialogActions>
          </Dialog>
          <DataGrid
            rows={categories}
            componentsProps={{
              row: {
                onContextMenu: handleContextMenu
              }
            }}
            columns={columns}
            checkboxSelection
            onSelectionModelChange={(ids) => {
              const selectedIds = new Set(ids);
              const selectedRows = categories
                .filter((category) => selectedIds.has(category._id))
                .map((category) => category._id);

              setSelectedCategoryIds(selectedRows);
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
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </Menu>
        </Grid>
      </main>
      <Footer sx={{ background: '#808080' }}></Footer>
    </>
  );
}
