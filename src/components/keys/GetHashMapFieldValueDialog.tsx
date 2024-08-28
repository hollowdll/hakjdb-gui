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
  InputAdornment,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { invokeGetHashMapFieldValues } from "../../tauri/command";
import { useLoadingStore } from "../../state/store";
import { useDialogStore } from "../../state/store";
import { useConnectionInfoStore } from "../../state/store";
import {
  allyPropsDialogActions,
  allyPropsDialogTextField,
  allyPropsDialogContentText,
} from "../../utility/props";

type GetHashMapFieldValuesDialogProps = {
  handleDisplayMsg: (msg: string) => void;
  handleDisplayHashMap: (hashMap: Record<string, string>) => void;
  handleHideContent: () => void;
};

export default function GetHashMapFieldValuesDialog(
  props: GetHashMapFieldValuesDialogProps,
) {
  const [errorMsg, setErrorMsg] = useState("");
  const [keyToUse, setKeyToUse] = useState("");
  const [fieldsToGet, setFieldsToGet] = useState<string[]>([""]);
  const setIsLoadingBackdropOpen = useLoadingStore(
    (state) => state.setIsLoadingBackdropOpen,
  );
  const dbToUse = useConnectionInfoStore(
    (state) => state.connectionInfo.defaultDb,
  );
  const setIsOpen = useDialogStore(
    (state) => state.setIsGetHashMapFieldValuesDialogOpen,
  );
  const isOpen = useDialogStore(
    (state) => state.isGetHashMapFieldValuesDialogOpen,
  );

  const handleClose = () => {
    setIsOpen(false);
  };

  const resetForm = () => {
    setKeyToUse("");
    setFieldsToGet([""]);
    setErrorMsg("");
  };

  const handleGetHashMapFieldValues = () => {
    setIsLoadingBackdropOpen(true);
    setErrorMsg("");
    invokeGetHashMapFieldValues(dbToUse, keyToUse, fieldsToGet)
      .then((result) => {
        if (result.ok) {
          const fieldValueMap: Record<string, string> = {};
          Object.entries(result.fieldValueMap).forEach(([field, value]) => {
            value.ok
              ? (fieldValueMap[field] = `"${value.value}"`)
              : (fieldValueMap[field] = "Field does not exist");
          });
          props.handleDisplayHashMap(fieldValueMap);
        } else {
          props.handleDisplayMsg("Key does not exist");
        }
        handleClose();
        resetForm();
      })
      .catch((err) => {
        setErrorMsg(`GetHashMapFieldValues failed: ${err}`);
        props.handleHideContent();
      })
      .finally(() => {
        setIsLoadingBackdropOpen(false);
      });
  };

  const keyInputChanged = (newValue: string) => {
    setKeyToUse(newValue);
  };

  const fieldInputChanged = (index: number, newValue: string) => {
    setFieldsToGet((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = newValue;
      return updatedItems;
    });
  };

  const handleAddNewField = () => {
    setFieldsToGet((prevItems) => [...prevItems, ""]);
  };

  const handleRemoveField = (index: number) => {
    setFieldsToGet((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems.splice(index, 1);
      return updatedItems;
    });
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>GetHashMapFieldValues</DialogTitle>
      <DialogContent>
        <DialogContentText
          {...allyPropsDialogContentText()}
        ></DialogContentText>
        <TextField
          label="Key"
          name="key"
          value={keyToUse}
          onChange={(event) => keyInputChanged(event.target.value)}
          {...allyPropsDialogTextField()}
        />
        {fieldsToGet.map((item, index) => (
          <TextField
            key={index}
            label="Field"
            name="field"
            value={item}
            onChange={(event) => fieldInputChanged(index, event.target.value)}
            {...allyPropsDialogTextField()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveField(index)}
                    sx={{ "&:focus": { outline: "none" } }}
                  >
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        ))}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNewField}
          sx={{ marginTop: "15px" }}
        >
          New Field
        </Button>
      </DialogContent>
      <Box
        sx={{ marginLeft: "25px", marginRight: "25px", marginBottom: "10px" }}
      >
        {errorMsg !== "" ? (
          <Typography sx={{ marginTop: "15px" }}>{errorMsg}</Typography>
        ) : (
          <></>
        )}
      </Box>
      <DialogActions {...allyPropsDialogActions()}>
        <Button variant="contained" onClick={handleGetHashMapFieldValues}>
          Ok
        </Button>
        <Button variant="outlined" onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
