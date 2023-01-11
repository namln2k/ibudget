import React, { useState, useEffect } from 'react';
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

  const autoHideDuration = 3000;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (props.open) {
      setOpen(true);
      timeoutId = setTimeout(() => {
        setOpen(false);
      }, autoHideDuration);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [props.open]);

  return (
    <>
      {open && (
        <Snackbar
          anchorOrigin={{
            vertical: defaultPosition.vertical,
            horizontal: defaultPosition.horizontal
          }}
          open={open}
        >
          <Alert severity={props.type} sx={{ width: '100%' }}>
            {props.children}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}
