import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Input,
  Link,
  Stack,
  Snackbar
} from '@mui/material';
import classNames from 'classnames';
import styles from './Signup.module.scss';
import * as userHelper from '../../helper/user';
import MessageDialog from '../../components/MessageDialog';

export default function Signup() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);

  const router = useRouter();

  const firstnameRef = useRef();

  useEffect(() => {
    firstnameRef.current.querySelectorAll('input')[0].focus();
  }, []);

  useEffect(() => {
    let timeoutId;

    if (success) {
      timeoutId = setTimeout(() => {
        setMessageOpen(false);
        router.push('/login');
      }, 5000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password != rePassword) {
      alert('Password confirmatin does not match. Please double check!');
      return;
    }

    try {
      userHelper.validateSignupInfo({
        firstname,
        lastname,
        username,
        password
      });
    } catch (e) {
      alert(e);
      return;
    }

    const response = await axios.post('/api/auth/signup', {
      firstname,
      lastname,
      username,
      password
    });
    const responseData = response.data;

    if (responseData.statusCode === 400) {
      alert(responseData.error);
    } else if (responseData.statusCode === 200) {
      setSuccess(true);
    } else {
      alert('Something went wrong!');
    }
  };

  return (
    <>
      <Head>
        <title>Signup</title>
      </Head>
      <Grid
        className={classNames(styles.signup)}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <MessageDialog type="success" open={success}>
          Your account has been created! You will be automatically redirect to
          login page in 5 seconds
        </MessageDialog>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          className={classNames(styles.signupWrapper)}
        >
          <Grid className={classNames(styles.part, styles.form)}>
            <Grid className={classNames(styles.formWrapper)}>
              <Grid className={classNames(styles.imageWrapper)}>
                <Grid className={classNames(styles.image)}>
                  <Link
                    sx={{ display: 'block', width: '100%', height: '100%' }}
                    href="/"
                  ></Link>
                </Grid>
              </Grid>
              <Typography sx={{ marginTop: '24px' }}>
                Create a free account
              </Typography>
              <form
                className={classNames(styles.form)}
                onSubmit={handleSubmit}
                sx={{ marginTop: '12px' }}
              >
                <FormControl
                  fullWidth
                  required
                  variant="standard"
                  className={classNames(styles.formControl)}
                >
                  <InputLabel htmlFor="firstname">First name</InputLabel>
                  <Input
                    id="firstname"
                    autoComplete="off"
                    aria-describedby="firstname"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    ref={firstnameRef}
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  required
                  variant="standard"
                  className={classNames(styles.formControl)}
                >
                  <InputLabel htmlFor="lastname">Last name</InputLabel>
                  <Input
                    id="lastname"
                    autoComplete="off"
                    aria-describedby="lastname"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  required
                  variant="standard"
                  className={classNames(styles.formControl)}
                >
                  <InputLabel htmlFor="username">Username</InputLabel>
                  <Input
                    id="username"
                    autoComplete="off"
                    aria-describedby="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  required
                  variant="standard"
                  className={classNames(styles.formControl)}
                >
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input
                    id="password"
                    aria-describedby="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                  />
                </FormControl>
                <FormControl
                  fullWidth
                  required
                  variant="standard"
                  className={classNames(styles.formControl)}
                >
                  <InputLabel htmlFor="re-password">
                    Confirm password
                  </InputLabel>
                  <Input
                    id="re-password"
                    aria-describedby="re-password"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                    type="password"
                  />
                </FormControl>
                <FormControl fullWidth>
                  <Button
                    variant="contained"
                    color="warning"
                    size="large"
                    type="submit"
                    className={classNames(styles.btnSignup)}
                    sx={{
                      marginTop: '32px'
                    }}
                  >
                    Signup
                  </Button>
                </FormControl>
              </form>
              <Grid
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '36px',
                  justifyContent: 'flex-end',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <Typography textAlign="right">
                  Already have an account?
                </Typography>
                <Button variant="outlined" color="error" href="/login">
                  Login now
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            className={classNames(styles.part, styles.info)}
          >
            <Grid
              container
              alignItems="center"
              className={classNames(styles.wrapper)}
              sx={{
                color: '#fff',
                padding: '0 64px'
              }}
            >
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: '40px',
                  lineHeight: '48px'
                }}
              >
                iBudget
              </Typography>
              <Typography
                sx={{
                  marginTop: '16px'
                }}
                textAlign="justify"
              >
                A comprehensive and effective solution for managing your
                personal monthly expenses. Many powerful and easy-to-use
                features, we are confident to bring you personal financial
                management performance than ever.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
