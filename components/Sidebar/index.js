import { Grid } from '@mui/material';
import classNames from 'classnames';
import styles from './Sidebar.module.scss';
import SidebarItem from './SidebarItem';

function Sidebar() {
  return (
    <Grid className={classNames(styles.sidebar)}>
      <Grid className={classNames(styles.wrapper)}>
        <SidebarItem label="Dashboard" to="/dashboard"></SidebarItem>
        <SidebarItem label="Charts" to="/charts" as="/charts"></SidebarItem>
        <SidebarItem label="Account settings" as="/me" to="/me"></SidebarItem>
        <SidebarItem label="Groups" to="/groups"></SidebarItem>
        <SidebarItem label="Personal budget">
          <SidebarItem
            label="Categories"
            to="/categories"
            as="/categories"
          ></SidebarItem>
          <SidebarItem
            label="Transactions"
            to="/transactions"
            as="/transactions"
            options={{ action: 'no-action' }}
          ></SidebarItem>
          <SidebarItem
            label="Add an income"
            as="/transactions"
            to="/transactions"
            options={{ action: 'add-income' }}
          ></SidebarItem>
          <SidebarItem
            label="Add an expense"
            as="/transactions"
            to="/transactions"
            options={{ action: 'add-expense' }}
          ></SidebarItem>
        </SidebarItem>
      </Grid>
    </Grid>
  );
}

export default Sidebar;
