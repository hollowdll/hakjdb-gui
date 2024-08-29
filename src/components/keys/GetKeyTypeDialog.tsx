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
import { invokeGetKeyType } from "../../tauri/command";
import { useLoadingStore } from "../../state/store";
import { useDialogStore } from "../../state/store";
import {
  allyPropsDialogActions,
  allyPropsDialogTextField,
} from "../../utility/props";
import { useConnectionInfoStore } from "../../state/store";

type GetTypeOfKeyParams = {
  key: string;
};

type GetKeyTypeDialogProps = {
  handleDisplayMsg: (msg: string) => void;
  handleHideContent: () => void;
};

export default function GetKeyTypeDialog(props: GetKeyTypeDialogProps) {
  const [errorMsg, setErrorMsg] = useState("");
  const [params, setParams] = useState<GetTypeOfKeyParams>({
    key: "",
  });
  const setIsLoadingBackdropOpen = useLoadingStore(
    (state) => state.setIsLoadingBackdropOpen,
  );
  const dbToUse = useConnectionInfoStore(
    (state) => state.connectionInfo.defaultDb,
  );
  const setIsOpen = useDialogStore((state) => state.setIsGetKeyTypeDialogOpen);
  const isOpen = useDialogStore((state) => state.isGetKeyTypeDialogOpen);

  const handleClose = () => {
    setIsOpen(false);
  };

  const resetForm = () => {
    setParams({
      key: "",
    });
    setErrorMsg("");
  };

  const handleGetKeyType = () => {
    setIsLoadingBackdropOpen(true);
    setErrorMsg("");
    invokeGetKeyType(dbToUse, params.key)
      .then((result) => {
        handleClose();
        if (result.ok) {
          props.handleDisplayMsg(`"${result.keyType}"`);
        } else {
          props.handleDisplayMsg("Key does not exist");
        }
        resetForm();
      })
      .catch((err) => {
        setErrorMsg(`GetTypeOfKey failed: ${err}`);
        props.handleHideContent();
      })
      .finally(() => {
        setIsLoadingBackdropOpen(false);
      });
  };

  const inputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setParams({ ...params, [event.target.name]: event.target.value });
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>GetKeyType</DialogTitle>
      <DialogContent>
        <TextField
          label="Key"
          name="key"
          value={params.key}
          onChange={inputChanged}
          {...allyPropsDialogTextField()}
        />
        {errorMsg !== "" ? (
          <Typography sx={{ marginTop: "15px" }}>{errorMsg}</Typography>
        ) : (
          <></>
        )}
      </DialogContent>
      <DialogActions {...allyPropsDialogActions()}>
        <Button variant="contained" onClick={handleGetKeyType}>
          Ok
        </Button>
        <Button variant="outlined" onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
