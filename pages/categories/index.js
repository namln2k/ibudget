import Head from 'next/head';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Button, Grid, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import styles from './Categories.module.scss';
import FullScreenLoader from '../../components/FullScreenLoader';
import axios from 'axios';
import MessageDialog from '../../components/MessageDialog';
import { useUserContext } from '../../contexts/user';

const columns = [
  { field: 'id', headerName: 'Index', width: 100 },
  { field: 'name', headerName: 'Category', width: 320 },
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
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [targetCategories, setTargetCategories] = useState([]);
  const [categoryToAdd, setCategoryToAdd] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useUserContext();

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const addCategory = async () => {
    setErrorMessage('');

    if (categoryToAdd.name === '') {
      setErrorMessage('Category name is required! Please fill in!');
      return;
    }

    categoryToAdd.userId = user._id;

    const response = await axios.post('/api/categories/add', categoryToAdd);
    const responseData = response.data;

    if (responseData.statusCode === 400) {
      setErrorMessage(responseData.error.toString());
    } else if (responseData.statusCode === 200) {
      setSuccessMessage('A new category has been added!');
      setIsDialogOpen(false);
      persistUserAndGetCategories();
    } else {
      setErrorMessage('Something went wrong!');
    }
  };

  const persistUserAndGetCategories = async () => {
    setIsLoading(true);
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

    setIsLoading(false);
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
        <FullScreenLoader open={isLoading}></FullScreenLoader>
        <MessageDialog type="error" open={errorMessage != ''}>
          {errorMessage}
        </MessageDialog>
        <MessageDialog type="success" open={successMessage != ''}>
          {successMessage}
        </MessageDialog>
        <Grid className={classNames(styles.content)}>
          <Button
            className={classNames(styles.btnAddCate)}
            onClick={openDialog}
          >
            <Typography variant="h6">Add a category</Typography>
          </Button>
          <Dialog
            open={isDialogOpen}
            onClose={handleClose}
            className={classNames(styles.dialog)}
          >
            <DialogTitle variant="h6" sx={{ textAlign: 'center' }}>
              Add a new category
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
                        value={categoryToAdd.name || ''}
                        onChange={(event) =>
                          setCategoryToAdd({
                            ...categoryToAdd,
                            name: event.target.value
                          })
                        }
                        sx={{ width: '240px' }}
                      />
                    )}
                    {renderField(
                      'Description',
                      <TextField
                        placeholder="Description"
                        variant="standard"
                        value={categoryToAdd.description || ''}
                        onChange={(event) =>
                          setCategoryToAdd({
                            ...categoryToAdd,
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
                onClick={addCategory}
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
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
          />
        </Grid>
      </main>
      <Footer sx={{ background: '#808080' }}></Footer>
    </>
  );
}
