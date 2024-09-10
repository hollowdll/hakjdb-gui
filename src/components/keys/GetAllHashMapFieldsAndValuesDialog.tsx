import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
  DialogContentText,
} from "@mui/material";
import { useState, ChangeEvent } from "react";
import { invokeGetAllHashMapFieldsAndValues } from "../../tauri/command";
import { useLoadingStore } from "../../state/store";
import { useDialogStore } from "../../state/store";
import {
  allyPropsDialogActions,
  allyPropsDialogContentText,
  allyPropsDialogTextField,
} from "../../utility/props";
import { useConnectionInfoStore } from "../../state/store";
import { textDecoder } from "../../utility/encoding";

type GetAllHashMapFieldsAndValuesDialogProps = {
  handleDisplayMsg: (msg: string) => void;
  handleDisplayHashMap: (hashMap: Record<string, string>) => void;
  handleHideContent: () => void;
};

export default function GetAllHashMapFieldsAndValuesDialog(
  props: GetAllHashMapFieldsAndValuesDialogProps,
) {
  const [errorMsg, setErrorMsg] = useState("");
  const [keyToUse, setKeyToUse] = useState("");
  const setIsLoadingBackdropOpen = useLoadingStore(
    (state) => state.setIsLoadingBackdropOpen,
  );
  const dbToUse = useConnectionInfoStore(
    (state) => state.connectionInfo.defaultDb,
  );
  const setIsOpen = useDialogStore(
    (state) => state.setIsGetAllHashMapFieldsAndValuesDialogOpen,
  );
  const isOpen = useDialogStore(
    (state) => state.isGetAllHashMapFieldsAndValuesDialogOpen,
  );

  const handleClose = () => {
    setIsOpen(false);
  };

  const resetForm = () => {
    setKeyToUse("");
    setErrorMsg("");
  };

  const handleGetAllHashMapFieldsAndValues = () => {
    setIsLoadingBackdropOpen(true);
    setErrorMsg("");
    invokeGetAllHashMapFieldsAndValues(dbToUse, keyToUse)
      .then((result) => {
        handleClose();
        if (result.ok) {
          const fieldValueMap: Record<string, string> = {};
          const fieldValueMapEntries = Object.entries(result.fieldValueMap);
          if (fieldValueMapEntries.length > 0) {
            for (const [field, value] of fieldValueMapEntries) {
              fieldValueMap[field] =
                `"${textDecoder.decode(new Uint8Array(value))}"`;
            }
            props.handleDisplayHashMap(fieldValueMap);
          } else {
            props.handleDisplayMsg("HashMap is empty");
          }
        } else {
          props.handleDisplayMsg("Key does not exist");
        }
        resetForm();
      })
      .catch((err) => {
        setErrorMsg(`GetAllHashMapFieldsAndValues failed: ${err}`);
        props.handleHideContent();
      })
      .finally(() => {
        setIsLoadingBackdropOpen(false);
      });
  };

  const inputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyToUse(event.target.value);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>GetAllHashMapFieldsAndValues</DialogTitle>
      <DialogContent>
        <DialogContentText {...allyPropsDialogContentText()}>
          Get all the fields and values of a HashMap key value.
        </DialogContentText>
        <TextField
          label="Key"
          name="key"
          value={keyToUse}
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
        <Button
          variant="contained"
          onClick={handleGetAllHashMapFieldsAndValues}
        >
          Ok
        </Button>
        <Button variant="outlined" onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
