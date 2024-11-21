// React Imports
import { FC } from "react";

// MUI Imports
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import DialogCloseButton from "@components/dialogs/DialogCloseButton";

// Define props interface
interface DialogsCustomizedProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  agreeText?: string;
  disagreeText?: string;
  onAgree?: () => void;
  onDisagree?: () => void;
}

const DialogsAlert: FC<DialogsCustomizedProps> = ({
  open,
  onClose,
  title,
  description,
  agreeText = "Agree",
  disagreeText = "Disagree",
  onAgree,
  onDisagree,
}) => {
  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      PaperProps={{ sx: { overflow: "visible" } }}
    >
      <DialogTitle id="customized-dialog-title">
        <Typography variant="h5" component="span">
          {title}
        </Typography>
        <DialogCloseButton onClick={onClose} disableRipple>
          <i className="tabler-x" />
        </DialogCloseButton>
      </DialogTitle>
      <DialogContent>
        <Typography>{description}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            if (onDisagree) onDisagree();
            onClose();
          }}
          variant="tonal"
          color="secondary"
        >
          {disagreeText}
        </Button>
        <Button
          onClick={() => {
            if (onAgree) onAgree();
            onClose();
          }}
          variant="contained"
        >
          {agreeText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogsAlert;
