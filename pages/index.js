import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Box, Grid, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import styles from '../styles/Home.module.scss';
import classNames from 'classnames';
import Footer from '../components/Footer';

export default function Home() {
  const router = useRouter();

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
              ></Image>
              <Image
                className={classNames(styles.logoIcon)}
                src="/images/logo-icon.png"
                width={48}
                height={48}
                alt="logo"
              ></Image>
            </Grid>
            <Grid className={classNames(styles.actions)}>
              <Button
                variant="text"
                className={classNames(styles.btn)}
                onClick={() => {
                  router.push('/signup');
                }}
              >
                Signup
              </Button>
              <Button
                className={classNames(styles.btn)}
                onClick={() => {
                  router.push('/login');
                }}
              >
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
        <Grid container className={classNames(styles.features)}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className={classNames(styles.feature)}
          >
            <Grid
              sx={{
                width: '32%',
                aspectRatio: '1/1',
                position: 'relative'
              }}
              container
              className={classNames(styles.item, styles.thumbnail)}
            >
              <Image
                src="/images/01.jpg"
                fill
                className={classNames(styles.image)}
                alt="feature-thumbnail"
              ></Image>
            </Grid>
            <Grid className={classNames(styles.item, styles.description)}>
              <Typography variant="h3" sx={{ marginBottom: '20px' }}>
                For those about to rock
              </Typography>
              <Typography variant="h6">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod
                aliquid, mollitia odio veniam sit iste esse assumenda amet
                aperiam exercitationem, ea animi blanditiis recusandae! Ratione
                voluptatum molestiae adipisci, beatae obcaecati.
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className={classNames(styles.feature)}
          >
            <Grid className={classNames(styles.item, styles.description)}>
              <Typography variant="h3" sx={{ marginBottom: '20px' }}>
                We salute you!
              </Typography>
              <Typography variant="h6">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod
                aliquid, mollitia odio veniam sit iste esse assumenda amet
                aperiam exercitationem, ea animi blanditiis recusandae! Ratione
                voluptatum molestiae adipisci, beatae obcaecati.
              </Typography>
            </Grid>
            <Grid
              sx={{
                width: '32%',
                aspectRatio: '1/1',
                position: 'relative'
              }}
              container
              className={classNames(styles.item, styles.thumbnail)}
            >
              <Image
                src="/images/02.jpg"
                fill
                className={classNames(styles.image)}
                alt="feature-thumbnail"
              ></Image>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className={classNames(styles.feature)}
          >
            <Grid
              sx={{
                width: '32%',
                aspectRatio: '1/1',
                position: 'relative'
              }}
              container
              className={classNames(styles.item, styles.thumbnail)}
            >
              <Image
                src="/images/03.jpg"
                fill
                className={classNames(styles.image)}
                alt="feature-thumbnail"
              ></Image>
            </Grid>
            <Grid className={classNames(styles.item, styles.description)}>
              <Typography variant="h3" sx={{ marginBottom: '20px' }}>
                Let there be rock!
              </Typography>
              <Typography variant="h6">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod
                aliquid, mollitia odio veniam sit iste esse assumenda amet
                aperiam exercitationem, ea animi blanditiis recusandae! Ratione
                voluptatum molestiae adipisci, beatae obcaecati.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Footer sx={{ background: 'rgba(0, 0, 0, 0.8)' }}></Footer>
      </main>
    </>
  );
}
