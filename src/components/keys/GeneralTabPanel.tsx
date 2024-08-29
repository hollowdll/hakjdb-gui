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
import { useLoadingStore, useThemeStore } from "../../state/store";
import { invokeGetAllKeys } from "../../tauri/command";
import { errorAlert } from "../../utility/alert";
import { useConnectionInfoStore } from "../../state/store";
import { useDialogStore } from "../../state/store";
import DeleteKeysDialog from "./DeleteKeysDialog";
import DeleteAllKeysDialog from "./DeleteAllKeysDialog";
import GetKeyTypeDialog from "./GetKeyTypeDialog";
import { boxBackgroundColor } from "../../style";

type GeneralTabMenuItems = {
  getAllKeys: string;
  deleteAllKeys: string;
  deleteKeys: string;
  getKeyType: string;
};

const menuItems: GeneralTabMenuItems = {
  getAllKeys: "GetAllKeys",
  deleteAllKeys: "DeleteAllKeys",
  deleteKeys: "DeleteKeys",
  getKeyType: "GetKeyType",
};

export default function GeneralTabPanel() {
  const [selectedItem, setSelectedItem] = useState("");
  const [isContentDisplayed, setIsContentDisplayed] = useState(false);
  const [displayedKeys, setDisplayedKeys] = useState<string[] | null>(null);
  const [displayedMsg, setDisplayedMsg] = useState("");
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const setIsLoadingBackdropOpen = useLoadingStore(
    (state) => state.setIsLoadingBackdropOpen,
  );
  const setIsGetKeyTypeDialogOpen = useDialogStore(
    (state) => state.setIsGetKeyTypeDialogOpen,
  );
  const setIsDeleteKeysDialogOpen = useDialogStore(
    (state) => state.setIsDeleteKeysDialogOpen,
  );
  const setIsDeleteAllKeysDialogOpen = useDialogStore(
    (state) => state.setIsDeleteAllKeysDialogOpen,
  );
  const dbToUse = useConnectionInfoStore(
    (state) => state.connectionInfo.defaultDb,
  );

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedItem(event.target.value as string);
  };

  const handleRunCommand = () => {
    switch (selectedItem) {
      case menuItems.getAllKeys:
        return handleGetKeys();
      case menuItems.deleteAllKeys:
        return handleDeleteAllKeys();
      case menuItems.deleteKeys:
        return handleDeleteKeys();
      case menuItems.getKeyType:
        return handleGetKeyType();
    }
  };

  const handleGetKeys = () => {
    setIsLoadingBackdropOpen(true);
    invokeGetAllKeys(dbToUse)
      .then((result) => {
        if (result.length < 1) {
          setDisplayedMsg("No keys in the database");
        }
        setDisplayedKeys(result);
        setIsContentDisplayed(true);
      })
      .catch((err) => {
        errorAlert(`Failed to get keys: ${err}`);
        setIsContentDisplayed(false);
      })
      .finally(() => {
        setIsLoadingBackdropOpen(false);
      });
  };

  const handleDeleteAllKeys = () => {
    setIsDeleteAllKeysDialogOpen(true);
  };

  const handleDeleteKeys = () => {
    setIsDeleteKeysDialogOpen(true);
  };

  const handleGetKeyType = () => {
    setIsGetKeyTypeDialogOpen(true);
  };

  const handleDisplayMsg = (msg: string) => {
    setDisplayedMsg(msg);
    setDisplayedKeys(null);
    setIsContentDisplayed(true);
  };

  const handleHideContent = () => {
    setDisplayedMsg("");
    setDisplayedKeys(null);
    setIsContentDisplayed(false);
  };

  return (
    <Box>
      <GetKeyTypeDialog
        handleDisplayMsg={handleDisplayMsg}
        handleHideContent={handleHideContent}
      />
      <DeleteKeysDialog
        handleDisplayMsg={handleDisplayMsg}
        handleHideContent={handleHideContent}
      />
      <DeleteAllKeysDialog
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
            sx={{ backgroundColor: boxBackgroundColor(isDarkMode) }}
          >
            <MenuItem value={menuItems.getAllKeys}>
              {menuItems.getAllKeys}
            </MenuItem>
            <MenuItem value={menuItems.deleteAllKeys}>
              {menuItems.deleteAllKeys}
            </MenuItem>
            <MenuItem value={menuItems.deleteKeys}>
              {menuItems.deleteKeys}
            </MenuItem>
            <MenuItem value={menuItems.getKeyType}>
              {menuItems.getKeyType}
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
          {displayedKeys && displayedKeys.length > 0 ? (
            <List>
              {displayedKeys.map((item, index) => (
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
                    {item}
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
