import { Grid, Typography } from '@mui/material';
import styles from './Footer.module.scss';
import classNames from 'classnames';

function Footer(props) {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={props.sx}
      className={classNames(styles.footer)}
    >
      <Typography className={classNames(styles.copyright)}>
        Copyright © Your Website 2022
      </Typography>
    </Grid>
  );
}

export default Footer;
