import { Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import { useRouter } from 'next/router';
import Image from 'next/image';
import classNames from 'classnames';
import styles from './Header.module.scss';
import SearchBar from 'material-ui-search-bar';
import { useUserContext } from '../../contexts/user';
import * as utilHelper from '../../helpers/util';
import FullScreenLoader from '../../components/FullScreenLoader';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';

export default function Header() {
  const [searchText, setSearchText] = useState('');

  const [isLoading, setIsLoading] = useState(true);

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
        const response = await axios.post('/api/auth/persist-user');
        const responseData = response.data;

        if (responseData.statusCode === 200) {
          setUser(responseData.data);
        }
      }

      setIsLoading(false);
    }

    persistUser();
  }, []);

  return (
    <>
      <FullScreenLoader open={isLoading}></FullScreenLoader>
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
            <SearchBar
              value={searchText}
              onChange={(newValue) => setSearchText(newValue)}
              onRequestSearch={() => {}}
              placeholder="Type here to search"
            />
          </form>
        </Grid>
        <Grid>
          <Typography className={styles.pageTitle}>Dashboard</Typography>
        </Grid>
        <Grid
          sx={{ visibility: isLoading ? 'hidden' : 'visible' }}
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
