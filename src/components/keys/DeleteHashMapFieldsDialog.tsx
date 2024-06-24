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
import { invokeDeleteHashMapFields } from "../../tauri/command";
import { useLoadingStore } from "../../state/store";
import { useDialogStore } from "../../state/store";
import { useConnectionInfoStore } from "../../state/store";
import {
  allyPropsDialogActions,
  allyPropsDialogTextField,
  allyPropsDialogContentText,
} from "../../utility/props";

type DeleteHashMapFieldsDialogProps = {
  handleDisplayMsg: (msg: string) => void;
  handleHideContent: () => void;
};

export default function DeleteHashMapFieldsDialog(
  props: DeleteHashMapFieldsDialogProps,
) {
  const [errorMsg, setErrorMsg] = useState("");
  const [keyToUse, setKeyToUse] = useState("");
  const [fieldsToDelete, setFieldsToDelete] = useState<string[]>([""]);
  const setIsLoadingBackdropOpen = useLoadingStore(
    (state) => state.setIsLoadingBackdropOpen,
  );
  const dbToUse = useConnectionInfoStore(
    (state) => state.connectionInfo.defaultDb,
  );
  const setIsOpen = useDialogStore(
    (state) => state.setIsDeleteHashMapFieldsDialogOpen,
  );
  const isOpen = useDialogStore(
    (state) => state.isDeleteHashMapFieldsDialogOpen,
  );

  const handleClose = () => {
    setIsOpen(false);
  };

  const resetForm = () => {
    setKeyToUse("");
    setFieldsToDelete([""]);
    setErrorMsg("");
  };

  const handleDeleteHashMapFields = () => {
    setIsLoadingBackdropOpen(true);
    setErrorMsg("");
    invokeDeleteHashMapFields(dbToUse, keyToUse, fieldsToDelete)
      .then((result) => {
        result.ok
          ? props.handleDisplayMsg(
              `Number of fields removed: ${result.fieldsRemoved}`,
            )
          : props.handleDisplayMsg("Key does not exist");
        handleClose();
        resetForm();
      })
      .catch((err) => {
        setErrorMsg(`DeleteHashMapFields failed: ${err}`);
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
    setFieldsToDelete((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = newValue;
      return updatedItems;
    });
  };

  const handleAddNewField = () => {
    setFieldsToDelete((prevItems) => [...prevItems, ""]);
  };

  const handleRemoveField = (index: number) => {
    setFieldsToDelete((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems.splice(index, 1);
      return updatedItems;
    });
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>DeleteHashMapFields</DialogTitle>
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
        {fieldsToDelete.map((item, index) => (
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
        <Button variant="contained" onClick={handleDeleteHashMapFields}>
          Ok
        </Button>
        <Button variant="outlined" onClick={handleClose} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
