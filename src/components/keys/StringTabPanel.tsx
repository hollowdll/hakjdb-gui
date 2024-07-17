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
import { useDialogStore, useThemeStore } from "../../state/store";
import SetStringDialog from "./SetStringDialog";
import GetStringDialog from "./GetStringDialog";
import { boxBackgroundColor } from "../../style";

type StringTabMenuItems = {
  setString: string;
  getString: string;
};

const menuItems: StringTabMenuItems = {
  setString: "SetString",
  getString: "GetString",
};

export default function StringTabPanel() {
  const [selectedItem, setSelectedItem] = useState("");
  const [isContentDisplayed, setIsContentDisplayed] = useState(false);
  const [displayedMsg, setDisplayedMsg] = useState("");
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const setIsSetStringDialogOpen = useDialogStore(
    (state) => state.setIsSetStringDialogOpen,
  );
  const setIsGetStringDialogOpen = useDialogStore(
    (state) => state.setIsGetStringDialogOpen,
  );

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedItem(event.target.value as string);
  };

  const handleSetString = () => {
    setIsSetStringDialogOpen(true);
  };

  const handleGetString = () => {
    setIsGetStringDialogOpen(true);
  };

  const handleRunCommand = () => {
    switch (selectedItem) {
      case menuItems.setString:
        return handleSetString();
      case menuItems.getString:
        return handleGetString();
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
      <SetStringDialog
        handleDisplayMsg={handleDisplayMsg}
        handleHideContent={handleHideContent}
      />
      <GetStringDialog
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
            <MenuItem value={menuItems.setString}>
              {menuItems.setString}
            </MenuItem>
            <MenuItem value={menuItems.getString}>
              {menuItems.getString}
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
