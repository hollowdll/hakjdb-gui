import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
  DialogContentText,
  Box,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import { invokeDeleteKey } from "../../tauri/command";
import { useLoadingStore } from "../../state/store";
import { useConnectionInfoStore } from "../../state/store";
import {
  allyPropsDialogActions,
  allyPropsDialogTextField,
  allyPropsDialogContentText,
} from "../../utility/props";

type DeleteKeyDialogProps = {
  isOpen: boolean,
  handleClose: () => void,
  handleDisplayMsg: (msg: string) => void,
  handleHideContent: () => void,
}

export default function DeleteKeyDialog(props: DeleteKeyDialogProps) {
  const [errorMsg, setErrorMsg] = useState("");
  const [keysToDelete, setKeysToDelete] = useState<string[]>([""]);
  const setIsLoadingBackdropOpen = useLoadingStore((state) => state.setIsLoadingBackdropOpen);
  const dbToUse = useConnectionInfoStore((state) => state.connectionInfo.defaultDb);

  const resetForm = () => {
    setKeysToDelete([""]);
    setErrorMsg("");
  }

  const handleDeleteKey = () => {
    setIsLoadingBackdropOpen(true);
    setErrorMsg("");
    invokeDeleteKey(dbToUse, keysToDelete)
      .then((result) => {
        props.handleClose();
        props.handleDisplayMsg(result.toString());
        resetForm();
      })
      .catch((err) => {
        setErrorMsg(`DeleteKey failed: ${err}`);
        props.handleHideContent();
      })
      .finally(() => {
        setIsLoadingBackdropOpen(false);
      });
  }

  const inputChanged = (index: number, newValue: string) => {
    setKeysToDelete(prevKeys => {
      const updatedKeys = [...prevKeys];
      updatedKeys[index] = newValue;
      return updatedKeys;
    })
  };

  const handleAddNewKey = () => {
    setKeysToDelete(prevKeys => [...prevKeys, ""]);
  }

  return (
    <Dialog open={props.isOpen} onClose={props.handleClose}>
      <DialogTitle>DeleteKey</DialogTitle>
      <DialogContent>
        <DialogContentText {...allyPropsDialogContentText()}>
          Specify the keys to delete.
        </DialogContentText>
        {keysToDelete.map((item, index) => (
          <TextField
            key={index}
            label="Key"
            name="key"
            value={item}
            onChange={(event) => inputChanged(index, event.target.value)}
            {...allyPropsDialogTextField()}
          />
        ))}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNewKey}
          sx={{ marginTop: "15px" }}
        >
          New Key
        </Button>
      </DialogContent>
      <Box sx={{ marginLeft: "25px", marginBottom: "10px" }}>
        {errorMsg !== "" ? (
          <Typography sx={{ marginTop: "15px" }}>{errorMsg}</Typography>
        ) : (
          <></>
        )}
      </Box>
      <DialogActions {...allyPropsDialogActions()}>
        <Button variant="contained" onClick={handleDeleteKey}>Ok</Button>
        <Button variant="outlined" onClick={props.handleClose} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}