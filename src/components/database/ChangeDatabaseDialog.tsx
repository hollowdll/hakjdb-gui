import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState, ChangeEvent } from "react";
import { invokeChangeDatabase } from "../../tauri/command";
import { successAlert } from "../../utility/alert";
import { useDatabaseStore } from "../../state/store";
import { useLoadingStore } from "../../state/store";
import { allyPropsDialogActions } from "../../utility/props";

type ChangeDatabaseDialogProps = {
  dbName: string;
  dbDescription: string;
  handleGetDatabaseInfo: (dbName: string) => void;
};

type FormFields = {
  name: string;
  description: string;
  changeName: boolean;
  changeDescription: boolean;
};

export default function ChangeDatabaseDialog({
  dbName,
  dbDescription,
  handleGetDatabaseInfo,
}: ChangeDatabaseDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formFields, setFormFields] = useState<FormFields>({
    name: dbName,
    description: dbDescription,
    changeName: true,
    changeDescription: true,
  });
  const [errorMsg, setErrorMsg] = useState("");
  const getAllDatabases = useDatabaseStore((state) => state.getAllDatabases);
  const setIsLoadingBackdropOpen = useLoadingStore(
    (state) => state.setIsLoadingBackdropOpen,
  );

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleOpen = () => {
    setFormFields({
      name: dbName,
      description: dbDescription,
      changeName: true,
      changeDescription: true,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setErrorMsg("");
  };

  const handleChangeDb = () => {
    setIsLoadingBackdropOpen(true);
    setErrorMsg("");
    invokeChangeDatabase(
      dbName,
      formFields.name,
      formFields.changeName,
      formFields.description,
      formFields.changeDescription,
    )
      .then(() => {
        handleClose();
        successAlert(`Successfully edited database`);
        resetForm();
        handleGetDatabaseInfo(formFields.name);
      })
      .catch((err) => {
        setErrorMsg(`Failed to edit database: ${err}`);
      })
      .finally(() => {
        setIsLoadingBackdropOpen(false);
        getAllDatabases();
      });
  };

  const inputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setFormFields({ ...formFields, [event.target.name]: event.target.value });
  };

  return (
    <>
      <Button variant="contained" endIcon={<EditIcon />} onClick={handleOpen}>
        Edit
      </Button>
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Edit database</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={formFields.name}
            onChange={inputChanged}
            fullWidth
            sx={{ marginTop: "10px" }}
          />
          <TextField
            label="Description"
            name="description"
            value={formFields.description}
            onChange={inputChanged}
            fullWidth
            sx={{ marginTop: "15px" }}
          />
          {errorMsg !== "" ? (
            <Typography sx={{ marginTop: "15px" }}>{errorMsg}</Typography>
          ) : (
            <></>
          )}
        </DialogContent>
        <DialogActions {...allyPropsDialogActions()}>
          <Button variant="contained" onClick={handleChangeDb}>
            Edit
          </Button>
          <Button variant="outlined" onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
