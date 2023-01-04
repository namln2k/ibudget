import classNames from 'classnames';
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Grid, Typography } from '@mui/material';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import styles from './SidebarItem.module.scss';

const redirect = ({ to, options }) => {
  if (!to) {
    return '/#';
  }

  return {
    pathname: to,
    query: options
  };
};

function SidebarItem(props) {
  const [isHovered, setIsHovered] = useState(false);

  const router = useRouter();

  const itemWrapper = useRef();

  const toggleHover = () => {
    setIsHovered(!isHovered);
  };

  return (
    <Grid
      ref={itemWrapper}
      className={classNames(styles.wrapper, isHovered && styles.hover)}
      onMouseEnter={toggleHover}
      onMouseLeave={toggleHover}
    >
      <Grid
        className={classNames('text-white', styles.sidebarItem)}
        onClick={() => {
          router.push(redirect(props), props.as || '');
        }}
      >
        <Grid className={classNames(styles.label)}>
          <Typography className={classNames(styles.labelText)}>
            {props.label}
          </Typography>
        </Grid>
        {props.children && (
          <ExpandMoreOutlinedIcon sx={{ color: '#fff' }} fontSize="large" />
        )}
      </Grid>
      <Grid>{props.children}</Grid>
    </Grid>
  );
}

export default SidebarItem;
