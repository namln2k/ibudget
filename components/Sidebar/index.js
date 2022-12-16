import classNames from 'classnames';
import SidebarItem from './SidebarItem';
import styles from './Sidebar.module.scss';
import { Grid } from '@mui/material';

function Sidebar() {
  return (
    <Grid className={classNames(styles.sidebar)}>
      <Grid className={classNames(styles.wrapper)}>
        <SidebarItem label={'Dashboard'}></SidebarItem>
        <SidebarItem label={'Trends (Charts)'}></SidebarItem>
        <SidebarItem label={'Account settings'}>
          <SidebarItem label={'Edit account'}></SidebarItem>
          <SidebarItem label={'View account info'}></SidebarItem>
          <SidebarItem label={'Share account info'}></SidebarItem>
        </SidebarItem>
        <SidebarItem label={'Team spending'}>
          <SidebarItem label={'Create new event'}></SidebarItem>
          <SidebarItem label={'View all events'}></SidebarItem>
        </SidebarItem>
        <SidebarItem label={'Personal records'}>
          <SidebarItem label={'View all records'}></SidebarItem>
          <SidebarItem label={'Add an expense'}></SidebarItem>
          <SidebarItem label={'Add an income'}></SidebarItem>
        </SidebarItem>
      </Grid>
    </Grid>
  );
}

export default Sidebar;
