import classNames from 'classnames';
import { useState, useRef } from 'react';
import { Grid, Typography } from '@mui/material';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import styles from './SidebarItem.module.scss';

function SidebarItem(props) {
  const [isHovered, setIsHovered] = useState(false);

  const itemWrapper = useRef();

  const toggleHover = () => {
    setIsHovered(!isHovered);
  };

  return (
    <Grid
      ref={itemWrapper}
      className={classNames(
        styles.wrapper,
        styles['level' + props.level],
        isHovered && styles.hover
      )}
      onMouseEnter={toggleHover}
      onMouseLeave={toggleHover}
    >
      <Grid className={classNames('text-white', styles.sidebarItem)}>
        <Grid className={classNames(styles.label)}>
          <Typography className={classNames(styles.labelText)}>
            {props.label}
          </Typography>
        </Grid>
        {props.children && <ExpandMoreOutlinedIcon sx={{ color: '#fff' }} fontSize="large" />}
      </Grid>
      <Grid>{props.children}</Grid>
    </Grid>
  );
}

export default SidebarItem;
