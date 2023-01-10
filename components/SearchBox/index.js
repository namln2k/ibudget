import { IconButton, InputBase, Paper } from '@mui/material';
import { Search } from '@mui/icons-material';
import React from 'react';
import classNames from 'classnames';

export default function SearchBox(props) {
  return (
    <Paper>
      <InputBase
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
      />
      <IconButton aria-label="search">
        <Search />
      </IconButton>
    </Paper>
  );
}
