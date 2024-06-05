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
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useState } from "react";
import { useLoadingStore } from "../../state/store";
import { invokeSetString } from "../../tauri/command";
import { errorAlert } from "../../utility/alert";

type StringTabMenuItems = {
  setString: string,
  getString: string,
}

const menuItems: StringTabMenuItems = {
  setString: "SetString",
  getString: "GetString",
}

export default function StringTabPanel() {
  const [selectedItem, setSelectedItem] = useState("");
  const [isContentDisplayed, setIsContentDisplayed] = useState(false);
  const [displayedMsg, setDisplayedMsg] = useState("");
  const setIsLoadingBackdropOpen = useLoadingStore((state) => state.setIsLoadingBackdropOpen);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedItem(event.target.value as string);
  }

  const handleRunCommand = () => {
    switch (selectedItem) {
      case menuItems.setString:
        return handleSetString();
      case menuItems.getString:
        return handleGetString();
    }
  }

  const handleSetString = () => {
    
  }

  const handleGetString = () => {

  }

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ marginTop: "20px", marginBottom: "10px" }}>
        <FormControl variant="outlined" sx={{ m: 1, minWidth: 200, backgroundColor: "rgb(250, 250, 250)" }}>
          <InputLabel>Select Command</InputLabel>
          <Select
            label="Select Command"
            value={selectedItem}
            onChange={handleChange}
          >
            <MenuItem value={menuItems.setString}>{menuItems.setString}</MenuItem>
            <MenuItem value={menuItems.getString}>{menuItems.getString}</MenuItem>
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