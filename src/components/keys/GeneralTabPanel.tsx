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
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useState } from "react";
import { useLoadingStore } from "../../state/store";
import { invokeGetKeys } from "../../tauri/command";
import { errorAlert } from "../../utility/alert";
import { useConnectionInfoStore } from "../../state/store";

type GeneralTabMenuItems = {
  getKeys: string,
  deleteAllKeys: string,
  deleteKey: string,
  getTypeOfKey: string,
}

const menuItems: GeneralTabMenuItems = {
  getKeys: "GetKeys",
  deleteAllKeys: "DeleteAllKeys",
  deleteKey: "DeleteKey",
  getTypeOfKey: "GetTypeOfKey",
}

export default function GeneralTabPanel() {
  const [selectedItem, setSelectedItem] = useState("");
  const [isContentDisplayed, setIsContentDisplayed] = useState(false);
  const [displayedKeys, setDisplayedKeys] = useState<string[] | null>(null);
  const [displayedMsg, setDisplayedMsg] = useState("");
  const setIsLoadingBackdropOpen = useLoadingStore((state) => state.setIsLoadingBackdropOpen);
  const dbToUse = useConnectionInfoStore((state) => state.connectionInfo.defaultDb);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedItem(event.target.value as string);
  }

  const handleRunCommand = () => {
    switch (selectedItem) {
      case menuItems.getKeys:
        return handleGetKeys();
      case menuItems.deleteAllKeys:
        return handleDeleteAllKeys();
      case menuItems.deleteKey:
        return handleDeleteKey();
      case menuItems.getTypeOfKey:
        return handleGetTypeOfKey();
    }
  }

  const handleGetKeys = () => {
    setIsLoadingBackdropOpen(true);
    invokeGetKeys(dbToUse)
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
      })
  }

  const handleDeleteAllKeys = () => {

  }

  const handleDeleteKey = () => {

  }

  const handleGetTypeOfKey = () => {

  }

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{marginTop: "20px", marginBottom: "10px"}}>
        <FormControl variant="outlined" sx={{ m: 1, minWidth: 200, backgroundColor: "rgb(250, 250, 250)" }}>
          <InputLabel>Select Command</InputLabel>
          <Select
            label="Select Command"
            value={selectedItem}
            onChange={handleChange}
          >
            <MenuItem value={menuItems.getKeys}>{menuItems.getKeys}</MenuItem>
            <MenuItem value={menuItems.deleteAllKeys}>{menuItems.deleteAllKeys}</MenuItem>
            <MenuItem value={menuItems.deleteKey}>{menuItems.deleteKey}</MenuItem>
            <MenuItem value={menuItems.getTypeOfKey}>{menuItems.getTypeOfKey}</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleRunCommand} endIcon={<PlayArrowIcon />}>Run</Button>
      </Stack>
      {isContentDisplayed ? (
        <Box
          sx={{
            p: 3,
            backgroundColor: "rgb(250, 250, 250)",
            width: "100%",
          }}
        >
          {displayedKeys && displayedKeys.length > 0 ? (
            <List>
              {displayedKeys.map((item, index) => (
                <ListItem
                  key={index}
                  disablePadding
                  sx={{display: "flex", justifyContent: "start", alignItems: "start"}}
                >
                  <Typography sx={{color: "text.secondary", marginRight: "20px"}}>{index + 1})</Typography>
                  <Typography sx={{wordBreak: "break-word"}}>{item}</Typography>
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