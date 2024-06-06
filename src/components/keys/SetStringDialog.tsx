import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useState, ChangeEvent } from "react";
import { invokeSetString } from "../../tauri/command";
import { successAlert } from "../../utility/alert";
import { useLoadingStore } from "../../state/store";
import { allyPropsDialogActions, allyPropsDialogTextField } from "../../utility/props";

type SetStringParams = {
  key: string,
  value: string,
}

type SetStringDialogProps = {
  isOpen: boolean,
  handleClose: () => void,
}

export default function SetStringDialog({isOpen, handleClose}: SetStringDialogProps) {
  const [errorMsg, setErrorMsg] = useState("");
  const [params, setParams] = useState<SetStringParams>({
    key: "",
    value: "",
  });
  const setIsLoadingBackdropOpen = useLoadingStore((state) => state.setIsLoadingBackdropOpen);

  const resetForm = () => {
    setParams({
      key: "",
      value: "",
    });
    setErrorMsg("");
  }

  const handleSetString = () => {
    setIsLoadingBackdropOpen(true);
    setErrorMsg("");
    invokeSetString(params.key, params.value)
      .then((_result) => {
        handleClose();
        successAlert("SetString success!");
        resetForm();
      })
      .catch((err) => {
        setErrorMsg(`SetString failed: ${err}`);
      })
      .finally(() => {
        setIsLoadingBackdropOpen(false);
      });
  }

  const inputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, [event.target.name]: event.target.value });
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>SetString</DialogTitle>
      <DialogContent>
        <TextField
          label="Key"
          name="key"
          value={params.key}
          onChange={inputChanged}
          {...allyPropsDialogTextField()}
        />
        <TextField
          label="Value"
          name="value"
          value={params.value}
          onChange={inputChanged}
          {...allyPropsDialogTextField()}
        />
        {errorMsg !== "" ? (
          <Typography sx={{marginTop: "15px"}}>{errorMsg}</Typography>
        ) : <></>}
      </DialogContent>
      <DialogActions {...allyPropsDialogActions()}>
        <Button variant="contained" onClick={handleSetString}>Ok</Button>
        <Button variant="outlined" onClick={handleClose} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}