import MenuIcon from '@mui/icons-material/Menu';
import { Box, Grid, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import classNames from 'classnames';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Footer from '../components/Footer';
import styles from '../styles/Home.module.scss';

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
                  router.push('/dashboard');
                }}
              >
                Dashboard
              </Button>
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
                src="https://drive.google.com/uc?export=view&id=1q36KfDoypV7e8SETMOmkgFmt4Ye_WnSn"
                fill
                className={classNames(styles.image)}
                alt="feature-thumbnail"
              ></Image>
            </Grid>
            <Grid className={classNames(styles.item, styles.description)}>
              <Typography variant="h3" sx={{ marginBottom: '20px' }}>
                Manage your wallet with Transactions and Categories
              </Typography>
              <Typography variant="h6">
                We'll help you track where your money is going: Categorizing
                your expenses can give you a clearer picture of how much you're
                spending in each area of your life, such as housing,
                transportation, groceries, and entertainment.
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
                Easy budgeting
              </Typography>
              <Typography variant="h6">
                We help make budgeting easier: Categorizing your expenses can
                help you create a budget by allowing you to see how much you're
                spending in each category and how it compares to your income.
                This can help you identify areas where you may be overspending
                or where you can cut back.
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
                src="https://drive.google.com/uc?export=view&id=11grnY3ytUrT4Xg9UJNGYjV5Yeixfpuy1"
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
                src="https://drive.google.com/uc?export=view&id=1ROrIVu30HB4FgKhDNAReV37sRvmR_hY2"
                fill
                className={classNames(styles.image)}
                alt="feature-thumbnail"
              ></Image>
            </Grid>
            <Grid className={classNames(styles.item, styles.description)}>
              <Typography variant="h3" sx={{ marginBottom: '20px' }}>
                Visualization with colorful charts
              </Typography>
              <Typography variant="h6">
                We draw your pictures in one place. With colorful and
                multi-functional charts. You can get a quick overview about your
                incomes and expenses at a glance and in one place.
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
                Manage your spending groups
              </Typography>
              <Typography variant="h6">
                Loans, debts are all managed in one function. You can be a pro
                event holder if you can use this with full potential. Experience
                and enjoy the convenience.
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
                src="https://drive.google.com/uc?export=view&id=1T_GY0nGV7UKD1uYkk9rKa45thb4vs9JA"
                fill
                className={classNames(styles.image)}
                alt="feature-thumbnail"
              ></Image>
            </Grid>
          </Grid>
        </Grid>
        <Footer sx={{ background: 'rgba(0, 0, 0, 0.8)' }}></Footer>
      </main>
    </>
  );
}
