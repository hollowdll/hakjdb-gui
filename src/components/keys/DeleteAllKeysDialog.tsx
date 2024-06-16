import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { invokeDeleteAllKeys } from "../../tauri/command";
import { useLoadingStore } from "../../state/store";
import { useDialogStore } from "../../state/store";
import { useConnectionInfoStore } from "../../state/store";
import { errorAlert } from "../../utility/alert";
import { allyPropsDialogActions } from "../../utility/props";

type DeleteAllKeysDialogProps = {
  handleDisplayMsg: (msg: string) => void;
  handleHideContent: () => void;
};

export default function DeleteAllKeysDialog(props: DeleteAllKeysDialogProps) {
  const setIsLoadingBackdropOpen = useLoadingStore(
    (state) => state.setIsLoadingBackdropOpen,
  );
  const dbToUse = useConnectionInfoStore(
    (state) => state.connectionInfo.defaultDb,
  );
  const setIsOpen = useDialogStore(
    (state) => state.setIsDeleteAllKeysDialogOpen,
  );
  const isOpen = useDialogStore((state) => state.isDeleteAllKeysDialogOpen);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDeleteAllKeys = () => {
    setIsLoadingBackdropOpen(true);
    setIsOpen(false);
    invokeDeleteAllKeys(dbToUse)
      .then((_result) => {
        props.handleHideContent();
        handleClose();
        props.handleDisplayMsg("OK");
      })
      .catch((err) => {
        errorAlert(`Failed to delete all keys: ${err}`);
        props.handleHideContent();
      })
      .finally(() => {
        setIsLoadingBackdropOpen(false);
      });
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Delete All Keys</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Delete all the keys of the database that is currently in use? Deleted
          keys cannot be restored.
        </DialogContentText>
      </DialogContent>
      <DialogActions {...allyPropsDialogActions()}>
        <Button variant="contained" onClick={handleDeleteAllKeys} color="error">
          Delete
        </Button>
        <Button variant="outlined" onClick={handleClose} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
