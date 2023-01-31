import Logout from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';
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
import SearchBox from '../SearchBox';
import styles from './Header.module.scss';

export default function Header() {
  const [searchText, setSearchText] = useState('');

  const [loading, setLoading] = useLoadingContext();

  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [user, setUser] = useUserContext();
  const { firstname, lastname } = user;
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

  return (
    <>
      <FullScreenLoader open={loading}></FullScreenLoader>
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
            onClick={() => router.push('/dashboard')}
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
            className={classNames(styles.menu)}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              sx: {
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& li': {
                  display: 'flex'
                },
                '& .MuiAvatar-root': {
                  width: 36,
                  height: 36
                }
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem>
              <Avatar /> My Profile
            </MenuItem>
            <Divider />
            <MenuItem>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>
    </>
  );
}
