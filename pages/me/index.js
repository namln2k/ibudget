import {
  Avatar,
  Button,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputLabel,
  TextareaAutosize,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import classNames from 'classnames';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import FormDialog from '../../components/FormDialog';
import Header from '../../components/Header';
import MessageDialog from '../../components/MessageDialog';
import Sidebar from '../../components/Sidebar';
import { useLoadingContext } from '../../contexts/loading';
import { useUserContext } from '../../contexts/user';
import * as userHelper from '../../helpers/user';
import * as utilHelper from '../../helpers/util';
import styles from './Me.module.scss';

const renderField = (field, content) => (
  <tr>
    <td>
      <Typography variant="h6" sx={{ margin: '6px' }}>
        {field + ':'}
      </Typography>
    </td>
    <td>{content}</td>
  </tr>
);

export default function Me(props) {
  const [user, setUser] = useUserContext();
  const [userToEdit, setUserToEdit] = useState();
  const [isButtonShown, setIsButtonShown] = useState(false);
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useLoadingContext();
  const [editPassword, setEditPassword] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [newBalance, setNewBalance] = useState();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      submitChanges();
    }
  };

  const persistUserAndGetRandomQuote = async () => {
    if (!!user) {
      const userResponse = await axios.post('/api/auth/persist-user');
      const responseData = userResponse.data;

      if (responseData.statusCode === 200) {
        let fetchedUser = responseData.data;

        if (!fetchedUser.quote) {
          const quoteResponse = await axios.get(
            'https://api.quotable.io/random'
          );

          if (quoteResponse?.data?.content) {
            const quote = quoteResponse?.data?.content;

            fetchedUser = { ...fetchedUser, quote };
          }
        }

        setUser(fetchedUser);
      } else {
        setErrorMessage(
          'Something went wrong while fetching user information!'
        );
      }
    } else {
      if (!user.quote) {
        const quoteResponse = await axios.get('https://api.quotable.io/random');

        let cloneData = user;

        if (quoteResponse?.data?.content) {
          const quote = quoteResponse?.data?.content;

          cloneData = { ...user, quote };
        }
      }

      setUser(cloneData);
    }

    setUserToEdit(user);
  };

  const submitChanges = async () => {
    setLoading(true);

    const response = await axios.post('/api/me/edit', userToEdit);

    const responseData = response?.data;

    if (responseData.statusCode === 200) {
      setSuccessMessage('Your changes has been submitted!');
      setErrorMessage('');
      persistUserAndGetRandomQuote();
    } else {
      setErrorMessage(responseData.error);
    }

    setLoading(false);
  };

  useEffect(() => {
    const getRandomQuote = async () => {
      const quoteResponse = await axios.get('https://api.quotable.io/random');

      if (quoteResponse?.data?.content) {
        setQuote(quoteResponse.data.content);
      }
    };

    getRandomQuote();
    persistUserAndGetRandomQuote();
  }, []);

  useEffect(() => {
    if (JSON.stringify(user) !== JSON.stringify(userToEdit)) {
      setIsButtonShown(true);
    }
  }, [userToEdit]);

  const renderForm = () => {
    if (editPassword) {
      return (
        <>
          <FormControl
            fullWidth
            required
            variant="standard"
            sx={{ marginTop: '16px' }}
          >
            <InputLabel htmlFor="new-password">New Password</InputLabel>
            <Input
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
            />
          </FormControl>
          <FormControl
            fullWidth
            required
            variant="standard"
            sx={{ marginTop: '16px' }}
          >
            <InputLabel htmlFor="re-password">Retype password</InputLabel>
            <Input
              id="re-password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              type="password"
            />
          </FormControl>
          <Typography
            sx={{
              fontSize: '14px',
              marginTop: '64px',
              fontWeight: 400,
              fontSize: '1rem',
              linHeight: 1.5,
              color: 'rgba(0, 0, 0, 0.6)',
              fontSize: '16px'
            }}
          >
            Confirm your current password
          </Typography>
          <FormControl
            fullWidth
            required
            variant="standard"
            sx={{ marginTop: '16px' }}
          >
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </FormControl>
        </>
      );
    } else {
      return (
        <>
          <FormControl
            fullWidth
            required
            variant="standard"
            sx={{ marginTop: '16px' }}
          >
            <InputLabel htmlFor="new-balance">New balance</InputLabel>
            <Input
              id="new-balance"
              value={newBalance || ''}
              onChange={(e) => setNewBalance(e.target.value)}
            />
          </FormControl>
        </>
      );
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

  const submitSecureChanges = async () => {
    if (editPassword) {
      if (newPassword !== rePassword) {
        setErrorMessage('Password not match!');
        return;
      }

      if (!userHelper.validatePassword(newPassword)) {
        setErrorMessage('Password must be at least 8 characters long!');
        return;
      }

      setLoading(true);

      const response = await axios.post('/api/me/change-password', {
        _id: user._id,
        newPassword,
        password
      });

      if (response?.data?.statusCode === 200) {
        setSuccessMessage('Your changes has been submitted!');
      } else {
        setErrorMessage(response?.data?.error);
      }

      const logoutResponse = await axios.post('/api/auth/logout');
      const logoutResponseData = logoutResponse.data;

      if (logoutResponseData.statusCode === 200) {
        router.push(
          {
            pathname: '/login',
            query: { message: 'Please re-login to continue!' }
          },
          '/login'
        );
      } else {
        setErrorMessage('Unable to log user out!');
      }
    } else {
      const response = await axios.post('/api/me/edit', {
        _id: user._id,
        balance: parseFloat(newBalance)
      });

      const responseData = response?.data;

      if (responseData.statusCode === 200) {
        setSuccessMessage('Your changes has been submitted!');
      } else {
        setErrorMessage(responseData.error);
      }
    }

    persistUserAndGetRandomQuote();

    setLoading(false);
  };

  const closeForm = () => {
    setPassword('');
    setNewPassword('');
    setRePassword('');
    setNewBalance();
    setFormOpen(false);
  };

  return (
    <>
      <Head>
        <title>My Account</title>
      </Head>
      <Header></Header>
      <MessageDialog type="error" open={errorMessage != ''}>
        {errorMessage}
      </MessageDialog>
      <MessageDialog type="success" open={successMessage != ''}>
        {successMessage}
      </MessageDialog>
      <FormDialog
        title={editPassword ? 'Change password' : 'Update balance'}
        contentText="Fill in all the fields and press submit"
        isOpen={formOpen}
        handleClose={() => {
          closeForm();
        }}
        handleConfirm={() => {
          submitSecureChanges();
          persistUserAndGetRandomQuote();
          closeForm();
        }}
        form={renderForm()}
      ></FormDialog>
      <main className={classNames(styles.main)}>
        <Sidebar></Sidebar>
        {userToEdit && user && (
          <Grid className={classNames(styles.content)}>
            <Grid
              sx={{
                width: '40%'
              }}
            >
              <Grid
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '128px'
                }}
              >
                <Grid className={styles.avatar}>
                  <input
                    accept="image/*"
                    className={styles.input}
                    id="icon-button-file"
                    type="file"
                  />
                  <label htmlFor="icon-button-file">
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                    >
                      <Avatar
                        className={styles.large}
                        {...utilHelper.stringAvatar(
                          user.firstname + ' ' + user.lastname,
                          { fontSize: '32px' }
                        )}
                      ></Avatar>
                    </IconButton>
                  </label>
                </Grid>
                <Grid className={classNames(styles.userId)}>
                  <Typography sx={{ fontWeight: 'bold', fontSize: 'larger' }}>
                    User ID:
                  </Typography>
                  <Typography
                    sx={{
                      cursor: 'pointer'
                    }}
                  >
                    {user._id}
                  </Typography>
                </Grid>
              </Grid>
              <Button
                variant="contained"
                sx={{ marginTop: '8px', padding: '16px 32px' }}
                onClick={() => {
                  setEditPassword(true);
                  setFormOpen(true);
                }}
              >
                <Typography variant="h4" textTransform="capitalize">
                  Change login password
                </Typography>
              </Button>
              <Grid sx={{ borderTop: '3px solid #888888', marginTop: '64px' }}>
                <Typography sx={{ marginTop: '24px' }} variant="h6">
                  {userToEdit.quote ? 'Favorite quote' : 'Random quote'}
                </Typography>
                <TextareaAutosize
                  variant="standard"
                  className={classNames(
                    styles.textArea,
                    styles.extraLongField,
                    styles.fieldQuote
                  )}
                  value={userToEdit.quote || quote || ''}
                  onChange={(event) =>
                    setUserToEdit({
                      ...userToEdit,
                      quote: event.target.value
                    })
                  }
                  minRows={5}
                  maxRows={8}
                />
              </Grid>
            </Grid>
            <Grid
              sx={{
                width: '50%'
              }}
            >
              <Grid
                sx={{
                  height: '128px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Typography sx={{ fontSize: '32px', fontWeight: 'bold' }}>
                  Account Balance:
                </Typography>
                <Typography
                  sx={{ fontSize: '32px', marginLeft: 'calc(100% - 660px)' }}
                >
                  {utilHelper.formatCurrency(user.balance?.$numberDecimal)}
                </Typography>
                <Button
                  sx={{ marginLeft: '20px' }}
                  variant="outlined"
                  onClick={() => {
                    setEditPassword(false);
                    setFormOpen(true);
                  }}
                >
                  <Typography variant="h6">Edit</Typography>
                </Button>
              </Grid>
              <Grid
                className={classNames(styles.fakeTable)}
                onKeyDown={handleSubmit}
              >
                <table>
                  <tbody>
                    {renderField(
                      'First name',
                      <TextField
                        required
                        placeholder="First name"
                        variant="standard"
                        className={classNames(
                          styles.textField,
                          styles.longField
                        )}
                        value={userToEdit.firstname || ''}
                        onChange={(event) =>
                          setUserToEdit({
                            ...userToEdit,
                            firstname: event.target.value
                          })
                        }
                        autoComplete="off"
                      />
                    )}
                    {renderField(
                      'Last name',
                      <TextField
                        required
                        placeholder="Last name"
                        variant="standard"
                        className={classNames(
                          styles.textField,
                          styles.longField
                        )}
                        value={userToEdit.lastname || ''}
                        onChange={(event) =>
                          setUserToEdit({
                            ...userToEdit,
                            lastname: event.target.value
                          })
                        }
                        autoComplete="off"
                      />
                    )}
                    {renderField(
                      'Email',
                      <TextField
                        required
                        placeholder="Email"
                        variant="standard"
                        className={classNames(
                          styles.textField,
                          styles.longField
                        )}
                        value={userToEdit.email || ''}
                        onChange={(event) =>
                          setUserToEdit({
                            ...userToEdit,
                            email: event.target.value
                          })
                        }
                        autoComplete="off"
                      />
                    )}
                    {renderField(
                      'Phone number',
                      <TextField
                        required
                        placeholder="Phone number"
                        variant="standard"
                        className={classNames(
                          styles.textField,
                          styles.longField
                        )}
                        value={userToEdit.phone_number || ''}
                        onChange={(event) =>
                          setUserToEdit({
                            ...userToEdit,
                            phone_number: event.target.value
                          })
                        }
                        autoComplete="off"
                      />
                    )}
                  </tbody>
                </table>
                {isButtonShown && (
                  <Button
                    className={classNames(styles.btn)}
                    onClick={submitChanges}
                  >
                    <Typography variant="h6" sx={{ textTransform: 'none' }}>
                      Submit
                    </Typography>
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>
        )}
      </main>
      <Footer sx={{ background: '#808080' }}></Footer>
    </>
  );
}
