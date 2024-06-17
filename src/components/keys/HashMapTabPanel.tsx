import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useState } from "react";
import { useDialogStore } from "../../state/store";
import SetHashMapDialog from "./SetHashMapDialog";

type HashMapTabMenuItems = {
  setHashMap: string;
  getHashMapFieldValue: string;
  getAllHashMapFieldsAndValues: string;
  deleteHashMapFields: string;
};

const menuItems: HashMapTabMenuItems = {
  setHashMap: "SetHashMap",
  getHashMapFieldValue: "GetHashMapFieldValue",
  getAllHashMapFieldsAndValues: "GetAllHashMapFieldsAndValues",
  deleteHashMapFields: "DeleteHashMapFields",
};

export default function HashMapTabPanel() {
  const [selectedItem, setSelectedItem] = useState("");
  const [isContentDisplayed, setIsContentDisplayed] = useState(false);
  const [displayedMsg, setDisplayedMsg] = useState("");
  const setIsSetHashMapDialogOpen = useDialogStore(
    (state) => state.setIsSetHashMapDialogOpen,
  );

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedItem(event.target.value as string);
  };

  const handleSetHashMap = () => {
    setIsSetHashMapDialogOpen(true);
  };

  const handleGetHashMapFieldValue = () => {
    // setIsGetHashMapFieldValueDialogOpen(true);
  };

  const handleGetAllHashMapFieldsAndValues = () => {
    // setIsGetAllHashMapFieldsAndValuesDialogOpen(true);
  };

  const handleDeleteHashMapFields = () => {
    // setIsDeleteHashMapFieldsDialogOpen(true);
  };

  const handleRunCommand = () => {
    switch (selectedItem) {
      case menuItems.setHashMap:
        return handleSetHashMap();
      case menuItems.getHashMapFieldValue:
        return handleGetHashMapFieldValue();
      case menuItems.getAllHashMapFieldsAndValues:
        return handleGetAllHashMapFieldsAndValues();
      case menuItems.deleteHashMapFields:
        return handleDeleteHashMapFields();
    }
  };

  const handleDisplayMsg = (msg: string) => {
    setDisplayedMsg(msg);
    setIsContentDisplayed(true);
  };

  const handleHideContent = () => {
    setDisplayedMsg("");
    setIsContentDisplayed(false);
  };

  return (
    <Box>
      <SetHashMapDialog
        handleDisplayMsg={handleDisplayMsg}
        handleHideContent={handleHideContent}
      />
      <Stack
        direction="row"
        spacing={2}
        sx={{ marginTop: "20px", marginBottom: "10px" }}
      >
        <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }}>
          <InputLabel>Select RPC</InputLabel>
          <Select
            label="Select RPC"
            value={selectedItem}
            onChange={handleChange}
            sx={{ backgroundColor: "rgb(250, 250, 250)" }}
          >
            <MenuItem value={menuItems.setHashMap}>
              {menuItems.setHashMap}
            </MenuItem>
            <MenuItem value={menuItems.getHashMapFieldValue}>
              {menuItems.getHashMapFieldValue}
            </MenuItem>
            <MenuItem value={menuItems.getAllHashMapFieldsAndValues}>
              {menuItems.getAllHashMapFieldsAndValues}
            </MenuItem>
            <MenuItem value={menuItems.deleteHashMapFields}>
              {menuItems.deleteHashMapFields}
            </MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={handleRunCommand}
          endIcon={<PlayArrowIcon />}
        >
          Run
        </Button>
      </Stack>
      {isContentDisplayed ? (
        <Box
          sx={{
            p: 3,
            backgroundColor: "rgb(250, 250, 250)",
            width: "100%",
          }}
        >
          {displayedMsg !== "" ? (
            <Typography>{displayedMsg}</Typography>
          ) : (
            <></>
          )}
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
}
