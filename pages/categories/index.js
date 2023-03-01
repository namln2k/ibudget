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
import { useEffect, useState } from 'react';
import ConfirmDialog from '../../components/ConfirmDialog';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import MessageDialog from '../../components/MessageDialog';
import Sidebar from '../../components/Sidebar';
import { useLoadingContext } from '../../contexts/loading';
import * as utilHelper from '../../helpers/util';
import styles from './Categories.module.scss';

const columns = [
  { field: 'index', headerName: 'Index', width: 100 },
  { field: 'name', headerName: 'Category name', width: 360 },
  { field: 'description', headerName: 'Description', width: 720 },
  { field: 'monthly_target_display', headerName: 'Monthly target', width: 240 }
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

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

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
    setSelectedCategoryId();
    setContextMenu(null);
  };

  const handleEdit = async () => {
    setIsEdit(true);
    closeContextMenu();
    setLoading(true);

    const response = await axios.get(
      `/api/categories/get/${selectedCategoryId}`
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

  const openConfirmDialog = () => {
    closeContextMenu();
    setIsConfirmDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedCategoryId && selectedCategoryIds.length) {
      if (
        selectedCategoryIds.length === 1 &&
        selectedCategoryIds[0] === selectedCategoryId
      ) {
        deleteCate([selectedCategoryId]);
      } else {
        setErrorMessage(
          'Please choose either to delete one category or many categories!'
        );
      }
    } else if (selectedCategoryId) {
      deleteCate([selectedCategoryId]);
    } else if (selectedCategoryIds.length) {
      deleteCate(selectedCategoryIds);
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

  const handleKeyDown = async (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!category.name.trim()) {
      setErrorMessage('Category name is required! Please fill in!');
      return;
    }

    setCategory({ ...category, name: category.name.trim() });

    let response;

    if (isEdit) {
      const categoryToEdit = category;

      response = await axios.post(
        `/api/categories/edit/${category._id}`,
        categoryToEdit
      );
    } else {
      const categoryToAdd = category;

      if (categories.find((category) => category.name === categoryToAdd.name)) {
        setErrorMessage('Category name must be unique!');
        return;
      }

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
      fetchCategories();
    } else {
      setErrorMessage('Something went wrong!');
    }

    setLoading(false);
  };

  const deleteCate = async (cateIds) => {
    setLoading(true);

    const response = await axios.get(
      `/api/categories/delete/${JSON.stringify(cateIds)}`
    );
    const responseData = response.data;

    if (responseData.statusCode === 400) {
      setErrorMessage(responseData.error.toString());
    } else if (responseData.statusCode === 200) {
      const deletedCount = responseData.data.deletedCount;
      if (
        (!contextMenu && selectedCategoryIds.length != deletedCount) ||
        (contextMenu && deletedCount != 1)
      ) {
        setSuccessMessage('');
        setErrorMessage('Some categories may not have been deleted!');
      } else {
        setErrorMessage('');
        setSuccessMessage(
          `Deleted ${responseData.data.deletedCount} category(s)!`
        );
      }

      fetchCategories();
    } else {
      setErrorMessage('Something went wrong!');
    }

    setLoading(false);
  };

  const deleteSelected = async () => {
    if (selectedCategoryIds.length === 0) {
      return;
    }

    setIsConfirmDialogOpen(true);
  };

  const fetchCategories = async () => {
    const response = await axios.get(`/api/categories/get`);
    const responseData = response.data;

    if (responseData.statusCode === 200) {
      setCategories(responseData.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <Head>
        <title>Categories</title>
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
                    {renderField(
                      'Monthly target',
                      <TextField
                        placeholder="Monthly target"
                        variant="standard"
                        value={category.monthly_target?.$numberDecimal || ''}
                        onChange={(event) =>
                          setCategory({
                            ...category,
                            monthly_target: {
                              $numberDecimal: event.target.value
                            }
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
          <Typography
            sx={{
              fontStyle: 'italic',
              fontWeight: 700,
              marginBottom: '8px',
              marginRight: 0
            }}
          >
            Note: Right click to edit
          </Typography>
          <DataGrid
            rows={categories.map((cate) => {
              cate.monthly_target_display = cate.monthly_target?.$numberDecimal
                ? utilHelper.formatCurrency(cate.monthly_target.$numberDecimal)
                : '';

              return cate;
            })}
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
            <MenuItem onClick={openConfirmDialog}>Delete</MenuItem>
          </Menu>
        </Grid>
      </main>
      <Footer sx={{ background: '#808080' }}></Footer>
    </>
  );
}
