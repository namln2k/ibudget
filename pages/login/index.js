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
  Link
} from '@mui/material';
import classNames from 'classnames';
import styles from './Login.module.scss';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const usernameRef = useRef();

  useEffect(() => {
    usernameRef.current.querySelectorAll('input')[0].focus();
  }, []);

  const getInitialProps = (context) => {
    console.log(context);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    /**
     * TODO:
     * Show error message (Alert popup)
     */

    const response = await axios.post('/api/auth/login', {
      username,
      password
    });
    const responseData = response.data;

    if (responseData.statusCode === 400) {
      alert(responseData.message);
    } else if (responseData.statusCode === 200) {
      router.push('/dashboard/user');
    } else {
      alert('Something went wrong!');
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Grid
        className={classNames(styles.login)}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          className={classNames(styles.loginWrapper)}
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
                Please login to continue
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
                  <InputLabel htmlFor="username">Username</InputLabel>
                  <Input
                    id="username"
                    autoComplete="off"
                    aria-describedby="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    ref={usernameRef}
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
                    autoComplete="off"
                    aria-describedby="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                  />
                </FormControl>
                <FormControl fullWidth>
                  <Button
                    variant="contained"
                    color="warning"
                    size="large"
                    type="submit"
                    className={classNames(styles.btnLogin)}
                    sx={{
                      marginTop: '32px'
                    }}
                  >
                    Login
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
                  Don't have an account?
                </Typography>
                <Button variant="outlined" color="error" href="/signup">
                  Create new
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
