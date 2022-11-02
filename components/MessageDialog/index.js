import React, { useState } from 'react';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={24} ref={ref} variant="filled" {...props} />;
});

export default function MessageDialog(props) {
  const defaultPosition = {
    vertical: 'top',
    horizontal: 'center'
  };

  const autoHideDuration = 5000;

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: defaultPosition.vertical,
          horizontal: defaultPosition.horizontal
        }}
        open={props.open}
        autoHideDuration={autoHideDuration}
      >
        <Alert severity={props.type} sx={{ width: '100%' }}>
          {props.children}
        </Alert>
      </Snackbar>
    </>
  );
}
