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
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { invokeSetHashMap } from "../../tauri/command";
import { useLoadingStore } from "../../state/store";
import { useDialogStore } from "../../state/store";
import { useConnectionInfoStore } from "../../state/store";
import {
  allyPropsDialogActions,
  allyPropsDialogTextField,
  allyPropsDialogContentText,
} from "../../utility/props";
import { textEncoder } from "../../utility/encoding";

type SetHashMapDialogProps = {
  handleDisplayMsg: (msg: string) => void;
  handleHideContent: () => void;
};

type FieldValuePair = {
  field: string;
  value: string;
};

export default function SetHashMapDialog(props: SetHashMapDialogProps) {
  const [errorMsg, setErrorMsg] = useState("");
  const [keyToUse, setKeyToUse] = useState("");
  const [fieldsToSet, setFieldsToSet] = useState<FieldValuePair[]>([
    { field: "", value: "" },
  ]);
  const setIsLoadingBackdropOpen = useLoadingStore(
    (state) => state.setIsLoadingBackdropOpen,
  );
  const dbToUse = useConnectionInfoStore(
    (state) => state.connectionInfo.defaultDb,
  );
  const setIsOpen = useDialogStore((state) => state.setIsSetHashMapDialogOpen);
  const isOpen = useDialogStore((state) => state.isSetHashMapDialogOpen);

  const handleClose = () => {
    setIsOpen(false);
  };

  const resetForm = () => {
    setKeyToUse("");
    setFieldsToSet([{ field: "", value: "" }]);
    setErrorMsg("");
  };

  const handleSetHashMap = () => {
    setIsLoadingBackdropOpen(true);
    setErrorMsg("");
    const keyValueMap: Record<string, number[]> = {};
    for (const fieldValuePair of fieldsToSet) {
      keyValueMap[fieldValuePair.field] = Array.from(
        textEncoder.encode(fieldValuePair.value),
      );
    }

    invokeSetHashMap(dbToUse, keyToUse, keyValueMap)
      .then((result) => {
        handleClose();
        props.handleDisplayMsg(`Number of fields added: ${result}`);
        resetForm();
      })
      .catch((err) => {
        setErrorMsg(`SetHashMap failed: ${err}`);
        props.handleHideContent();
      })
      .finally(() => {
        setIsLoadingBackdropOpen(false);
      });
  };

  const fieldChanged = (index: number, newField: string) => {
    setFieldsToSet((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index].field = newField;
      return updatedItems;
    });
  };

  const valueChanged = (index: number, newValue: string) => {
    setFieldsToSet((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index].value = newValue;
      return updatedItems;
    });
  };

  const handleAddNewFieldValuePair = () => {
    setFieldsToSet((prevItems) => [...prevItems, { field: "", value: "" }]);
  };

  const handleRemoveFieldValuePair = (index: number) => {
    setFieldsToSet((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems.splice(index, 1);
      return updatedItems;
    });
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>SetHashMap</DialogTitle>
      <DialogContent>
        <DialogContentText
          {...allyPropsDialogContentText()}
        ></DialogContentText>
        <TextField
          label="Key"
          name="key"
          value={keyToUse}
          onChange={(event) => setKeyToUse(event.target.value)}
          {...allyPropsDialogTextField()}
        />
        {fieldsToSet.map((item, index) => (
          <Box
            key={index}
            sx={{ marginTop: "15px", display: "flex", alignItems: "center" }}
          >
            <TextField
              label="Field"
              name="field"
              value={item.field}
              onChange={(event) => fieldChanged(index, event.target.value)}
              sx={{ marginRight: "10px" }}
            />
            <TextField
              label="Value"
              name="value"
              value={item.value}
              onChange={(event) => valueChanged(index, event.target.value)}
            />
            <IconButton
              onClick={() => handleRemoveFieldValuePair(index)}
              sx={{ "&:focus": { outline: "none" } }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        ))}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNewFieldValuePair}
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
        <Button variant="contained" onClick={handleSetHashMap}>
          Ok
        </Button>
        <Button variant="outlined" onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
