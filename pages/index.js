import Head from 'next/head';
import Image from 'next/image';
import { Box, Grid, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import styles from '../styles/Home.module.scss';
import classNames from 'classnames';

export default function Home() {
  return (
    <>
      <Head>
        <title>iBudget</title>
        <meta name="description" content="iBudget - Save to spend" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={classNames(styles.landingPage)}>
        <Grid
          container
          alignItems="center"
          className={classNames(styles.header)}
        >
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              height: '100%'
            }}
          >
            <Grid>
              <Image
                className={classNames(styles.logo)}
                src="/images/logo.png"
                width={142}
                height={48}
                alt="logo"
                priority
              ></Image>
              <Image
                className={classNames(styles.logoIcon)}
                src="/images/logo-icon.png"
                width={48}
                height={48}
                alt="logo"
                priority
              ></Image>
            </Grid>
            <Grid className={classNames(styles.actions)}>
              <Button
                variant="text"
                className={classNames(styles.btn)}
                href="/signup"
              >
                Signup
              </Button>
              <Button className={classNames(styles.btn)} href="/login">
                Login
              </Button>
            </Grid>
            <Grid className={classNames(styles.menuBtn)}>
              <MenuIcon style={{ color: '#fff' }} />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          justifyContent={'center'}
          alignItems={'center'}
          className={classNames(styles.banner)}
        >
          <Box className={classNames(styles.circle, styles.circle1)} />
          <Box className={classNames(styles.circle, styles.circle2)} />
          <Box className={classNames(styles.circle, styles.circle3)} />
          <Grid
            container
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            className={classNames(styles.content)}
          >
            <Typography className={classNames(styles.title)}>
              iBudget
            </Typography>
            <Typography className={classNames(styles.description)}>
              Save to spend
            </Typography>
            <Box
              justifyContent={'center'}
              alignItems={'center'}
              className={classNames(styles.seeMore)}
            >
              <Box className={classNames(styles.chevron)}></Box>
              <Box className={classNames(styles.chevron)}></Box>
              <Box className={classNames(styles.chevron)}></Box>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography className={classNames(styles.text)}>
                Scroll down to learn more
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </main>
    </>
  );
}
