import classNames from 'classnames';
import SidebarItem from './SidebarItem';
import styles from './Sidebar.module.scss';
import { Grid } from '@mui/material';

function Sidebar() {
  return (
    <Grid className={classNames(styles.sidebar)}>
      <Grid className={classNames(styles.wrapper)}>
        <SidebarItem label="Dashboard"></SidebarItem>
        <SidebarItem label="Trends (Charts)"></SidebarItem>
        <SidebarItem label="Account settings"></SidebarItem>
        <SidebarItem label="Team spending">
          <SidebarItem label="Create new event"></SidebarItem>
          <SidebarItem label="View all events"></SidebarItem>
          <SidebarItem label="Join an event"></SidebarItem>
        </SidebarItem>
        <SidebarItem label="Personal budget">
          <SidebarItem label="Plan new budget"></SidebarItem>
          <SidebarItem label="View all records"></SidebarItem>
          <SidebarItem label="Add an expense"></SidebarItem>
          <SidebarItem label="Add an income"></SidebarItem>
        </SidebarItem>
      </Grid>
    </Grid>
  );
}

export default Sidebar;
