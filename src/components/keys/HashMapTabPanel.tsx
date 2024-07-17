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
  List,
  ListItem,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useState } from "react";
import { useDialogStore, useThemeStore } from "../../state/store";
import SetHashMapDialog from "./SetHashMapDialog";
import GetAllHashMapFieldsAndValuesDialog from "./GetAllHashMapFieldsAndValuesDialog";
import DeleteHashMapFieldsDialog from "./DeleteHashMapFieldsDialog";
import GetHashMapFieldValueDialog from "./GetHashMapFieldValueDialog";
import { boxBackgroundColor } from "../../style";

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
  const [displayedHashMap, setDisplayedHashMap] = useState<Record<
    string,
    string
  > | null>(null);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const setIsSetHashMapDialogOpen = useDialogStore(
    (state) => state.setIsSetHashMapDialogOpen,
  );
  const setIsGetAllHashMapFieldsAndValuesDialogOpen = useDialogStore(
    (state) => state.setIsGetAllHashMapFieldsAndValuesDialogOpen,
  );
  const setIsDeleteHashMapFieldsDialogOpen = useDialogStore(
    (state) => state.setIsDeleteHashMapFieldsDialogOpen,
  );
  const setIsGetHashMapFieldValueDialogOpen = useDialogStore(
    (state) => state.setIsGetHashMapFieldValueDialogOpen,
  );

  const handleSelectedItemChange = (event: SelectChangeEvent) => {
    setSelectedItem(event.target.value as string);
  };

  const handleSetHashMap = () => {
    setIsSetHashMapDialogOpen(true);
  };

  const handleGetHashMapFieldValue = () => {
    setIsGetHashMapFieldValueDialogOpen(true);
  };

  const handleGetAllHashMapFieldsAndValues = () => {
    setIsGetAllHashMapFieldsAndValuesDialogOpen(true);
  };

  const handleDeleteHashMapFields = () => {
    setIsDeleteHashMapFieldsDialogOpen(true);
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
    setDisplayedHashMap(null);
    setIsContentDisplayed(true);
  };

  const handleDisplayHashMap = (hashMap: Record<string, string>) => {
    setDisplayedHashMap(hashMap);
    setDisplayedMsg("");
    setIsContentDisplayed(true);
  };

  const handleHideContent = () => {
    setDisplayedMsg("");
    setDisplayedHashMap(null);
    setIsContentDisplayed(false);
  };

  return (
    <Box>
      <SetHashMapDialog
        handleDisplayMsg={handleDisplayMsg}
        handleHideContent={handleHideContent}
      />
      <GetAllHashMapFieldsAndValuesDialog
        handleDisplayMsg={handleDisplayMsg}
        handleDisplayHashMap={handleDisplayHashMap}
        handleHideContent={handleHideContent}
      />
      <DeleteHashMapFieldsDialog
        handleDisplayMsg={handleDisplayMsg}
        handleHideContent={handleHideContent}
      />
      <GetHashMapFieldValueDialog
        handleDisplayMsg={handleDisplayMsg}
        handleDisplayHashMap={handleDisplayHashMap}
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
            onChange={handleSelectedItemChange}
            sx={{ backgroundColor: boxBackgroundColor(isDarkMode) }}
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
          color="success"
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
            backgroundColor: boxBackgroundColor(isDarkMode),
            width: "100%",
          }}
        >
          {displayedHashMap && Object.keys(displayedHashMap).length > 0 ? (
            <List>
              {Object.entries(displayedHashMap).map(([field, value], index) => (
                <ListItem
                  key={index}
                  disablePadding
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "start",
                  }}
                >
                  <Typography
                    sx={{ color: "text.secondary", marginRight: "20px" }}
                  >
                    {index + 1})
                  </Typography>
                  <Typography sx={{ wordBreak: "break-word" }}>
                    "{field}": {value}
                  </Typography>
                </ListItem>
              ))}
            </List>
          ) : displayedMsg !== "" ? (
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
