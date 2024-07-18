import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { invokeDeleteDatabase } from "../../tauri/command";
import { useLoadingStore } from "../../state/store";
import { successAlert, errorAlert } from "../../utility/alert";
import { useDatabaseStore } from "../../state/store";
import { allyPropsDialogActions } from "../../utility/props";

type DeleteDatabaseDialogProps = {
  dbName: string;
  closeDbListAccordion: () => void;
};

export default function DeleteDatabaseDialog({
  dbName,
  closeDbListAccordion,
}: DeleteDatabaseDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const getAllDatabases = useDatabaseStore((state) => state.getAllDatabases);
  const setIsLoadingBackdropOpen = useLoadingStore(
    (state) => state.setIsLoadingBackdropOpen,
  );

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleDeleteDb = () => {
    setIsLoadingBackdropOpen(true);
    setIsOpen(false);
    invokeDeleteDatabase(dbName)
      .then((result) => {
        successAlert(`Deleted database ${result}`);
        closeDbListAccordion();
      })
      .catch((err) => {
        errorAlert(`Failed to delete database: ${err}`);
      })
      .finally(() => {
        setIsLoadingBackdropOpen(false);
        getAllDatabases();
      });
  };

  return (
    <>
      <Button
        variant="contained"
        endIcon={<DeleteIcon />}
        color="error"
        onClick={handleOpen}
      >
        Delete
      </Button>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle sx={{ wordBreak: "break-word" }}>
          Delete Database {dbName}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deleted databases cannot be restored. Deleting a database also
            deletes all the keys stored in it.
          </DialogContentText>
        </DialogContent>
        <DialogActions {...allyPropsDialogActions()}>
          <Button variant="contained" onClick={handleDeleteDb} color="error">
            Delete
          </Button>
          <Button variant="outlined" onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
