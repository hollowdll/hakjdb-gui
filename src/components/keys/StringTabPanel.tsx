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
import SetStringDialog from "./SetStringDialog";

type StringTabMenuItems = {
  setString: string,
  getString: string,
}

type DialogsOpen = {
  isSetStringDialogOpen: boolean,
  isGetStringDialogOpen: boolean,
}

const menuItems: StringTabMenuItems = {
  setString: "SetString",
  getString: "GetString",
}

export default function StringTabPanel() {
  const [selectedItem, setSelectedItem] = useState("");
  const [isContentDisplayed, setIsContentDisplayed] = useState(false);
  const [displayedMsg, setDisplayedMsg] = useState("");
  const [dialogsOpen, setDialogsOpen] = useState<DialogsOpen>({
    isSetStringDialogOpen: false,
    isGetStringDialogOpen: false,
  });

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedItem(event.target.value as string);
  }

  const handleOpenSetStringDialog = () => {
    setDialogsOpen({ ...dialogsOpen, isSetStringDialogOpen: true });
  }

  const handleCloseSetStringDialog = () => {
    setDialogsOpen({ ...dialogsOpen, isSetStringDialogOpen: false });
  }

  const handleOpenGetStringDialog = () => {
    setDialogsOpen({ ...dialogsOpen, isGetStringDialogOpen: true });
  }

  const handleCloseGetStringDialog = () => {
    setDialogsOpen({ ...dialogsOpen, isGetStringDialogOpen: false });
  }

  const handleRunCommand = () => {
    switch (selectedItem) {
      case menuItems.setString:
        return handleOpenSetStringDialog();
      case menuItems.getString:
        return handleOpenGetStringDialog();
    }
  }

  return (
    <Box>
      <SetStringDialog isOpen={dialogsOpen.isSetStringDialogOpen} handleClose={handleCloseSetStringDialog} />
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