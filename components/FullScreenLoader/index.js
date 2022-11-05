import { Backdrop, CircularProgress } from '@mui/material';

export default function FullScreenLoader({ open }) {
  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: 10 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
