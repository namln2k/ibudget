import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

const FormDialog = ({
  title,
  contentText,
  form,
  isOpen,
  handleClose,
  handleConfirm
}) => {
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ fontSize: '32px', marginTop: '24px' }}>{title}</DialogTitle>
      <DialogContent sx={{ padding: '28px 120px 20px 32px !important' }}>
        <DialogContentText sx={{ fontSize: '16px' }}>
          {contentText}
        </DialogContentText>
        {form}
      </DialogContent>
      <DialogActions sx={{ padding: '32px' }}>
        <Button variant="outlined" onClick={handleClose} color="error">
          Cancel
        </Button>
        <Button variant="outlined" onClick={handleConfirm} color="success">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormDialog;
