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
              <Typography variant="h3">Title</Typography>
              <Typography variant="h6">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nobis
                dolore repudiandae a pariatur, aperiam culpa iusto fuga
                asperiores id facilis placeat maiores officiis at quis animi
                deleniti. Impedit, vero saepe? Eaque nulla corrupti voluptas eos
                sint. Repellat ratione, amet earum similique sunt hic quis modi.
                Ipsa voluptas non eos dolore veniam, a, repellendus, corporis
                repellat at sunt placeat porro adipisci! Adipisci minus porro
                consequuntur, itaque nostrum, aliquid rem et obcaecati veritatis
                eius tempora deleniti sapiente sint voluptatem atque iusto amet?
                Libero, cupiditate rerum? Excepturi, repellat. Hic ea error iure
                tenetur!
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
              <Typography variant="h3">Title</Typography>
              <Typography variant="h6">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nobis
                dolore repudiandae a pariatur, aperiam culpa iusto fuga
                asperiores id facilis placeat maiores officiis at quis animi
                deleniti. Impedit, vero saepe? Eaque nulla corrupti voluptas eos
                sint. Repellat ratione, amet earum similique sunt hic quis modi.
                Ipsa voluptas non eos dolore veniam, a, repellendus, corporis
                repellat at sunt placeat porro adipisci! Adipisci minus porro
                consequuntur, itaque nostrum, aliquid rem et obcaecati veritatis
                eius tempora deleniti sapiente sint voluptatem atque iusto amet?
                Libero, cupiditate rerum? Excepturi, repellat. Hic ea error iure
                tenetur!
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
                src="/images/01.jpg"
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
                src="/images/01.jpg"
                fill
                className={classNames(styles.image)}
                alt="feature-thumbnail"
              ></Image>
            </Grid>
            <Grid className={classNames(styles.item, styles.description)}>
              <Typography variant="h3">Title</Typography>
              <Typography variant="h6">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nobis
                dolore repudiandae a pariatur, aperiam culpa iusto fuga
                asperiores id facilis placeat maiores officiis at quis animi
                deleniti. Impedit, vero saepe? Eaque nulla corrupti voluptas eos
                sint. Repellat ratione, amet earum similique sunt hic quis modi.
                Ipsa voluptas non eos dolore veniam, a, repellendus, corporis
                repellat at sunt placeat porro adipisci! Adipisci minus porro
                consequuntur, itaque nostrum, aliquid rem et obcaecati veritatis
                eius tempora deleniti sapiente sint voluptatem atque iusto amet?
                Libero, cupiditate rerum? Excepturi, repellat. Hic ea error iure
                tenetur!
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          className={classNames(styles.footer)}
        >
          <Typography className={classNames(styles.copyright)}>
            Copyright © Your Website 2022
          </Typography>
        </Grid>
      </main>
    </>
  );
}
