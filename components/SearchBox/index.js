import { Search } from '@mui/icons-material';
import { IconButton, InputBase, Paper } from '@mui/material';
import classNames from 'classnames';
import React from 'react';
import styles from './SearchBox.module.scss';

export default function SearchBox({ placeholder, text, onChange, ...props }) {
  return (
    <Paper className={classNames(styles.wrapper)} {...props}>
      <InputBase
        placeholder={placeholder}
        value={text}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
      <IconButton aria-label="search">
        <Search />
      </IconButton>
    </Paper>
  );
}
