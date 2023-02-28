import Logout from '@mui/icons-material/Logout';
import { Grid, IconButton, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import classNames from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import FullScreenLoader from '../../components/FullScreenLoader';
import { useLoadingContext } from '../../contexts/loading';
import { useUserContext } from '../../contexts/user';
import * as utilHelper from '../../helpers/util';
import MessageDialog from '../MessageDialog';
import SearchBox from '../SearchBox';
import styles from './Header.module.scss';

export default function Header() {
  const [searchText, setSearchText] = useState('');

  const [loading, setLoading] = useLoadingContext();

  const [errorMessage, setErrorMessage] = useState();

  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const goToMyAccount = () => {
    router.push('/me');
    closeMenu();
  };

  const [user, setUser] = useUserContext();
  const { firstname, lastname } = user || {};
  const userFullName = firstname + ' ' + lastname;

  useEffect(() => {
    async function persistUser() {
      if (!!user) {
        setLoading(true);
        const response = await axios.post('/api/auth/persist-user');
        const responseData = response.data;

        if (responseData.statusCode === 200) {
          setUser(responseData.data);
        }
      }

      setLoading(false);
    }

    persistUser();
  }, []);

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

  const handleLogout = async () => {
    setUser();

    const response = await axios.post('/api/auth/logout');
    const responseData = response.data;

    if (responseData.statusCode === 200) {
      router.push('/login');
    } else {
      setErrorMessage('Unable to log user out!');
    }

    closeMenu();
  };

  return (
    <>
      <FullScreenLoader open={loading}></FullScreenLoader>
      <MessageDialog type="error" open={errorMessage}>
        <Typography>{errorMessage}</Typography>
      </MessageDialog>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        className={classNames(styles.header)}
      >
        <Grid>
          <Image
            className={classNames(styles.logo)}
            src="/images/logo.png"
            width={142}
            height={48}
            alt="logo"
            onClick={() => router.push('/')}
          ></Image>
        </Grid>
        <Grid className={classNames(styles.search)}>
          <Typography
            sx={{
              marginRight: '18px',
              fontWeight: 500,
              fontSize: '22px',
              color: '#fff'
            }}
          >
            What are you looking for?
          </Typography>
          <form>
            <SearchBox
              onChange={setSearchText}
              placeholder="Type here to search"
              value={searchText}
            />
          </form>
        </Grid>
        <Grid>
          <Typography className={styles.pageTitle}>Dashboard</Typography>
        </Grid>
        <Grid
          sx={{ visibility: loading ? 'hidden' : 'visible' }}
          flexDirection="row"
          alignItems="center"
          className={classNames(styles.userAccess)}
        >
          <Typography className={classNames(styles.greetings)}>
            Hello, {firstname} {lastname}
          </Typography>
          <Box
            sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}
          >
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar
                sx={{ width: 32, height: 32 }}
                {...utilHelper.stringAvatar(userFullName)}
              ></Avatar>
            </IconButton>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={closeMenu}
            onClick={closeMenu}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0
                }
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={goToMyAccount}>
              <Avatar />
              <Typography>My account</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <Typography>Logout</Typography>
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>
    </>
  );
}
