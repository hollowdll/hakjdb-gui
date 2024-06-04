import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack } from "@mui/material";
import { useState } from "react";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

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
        <FormControl variant="outlined" sx={{ m: 1, minWidth: 150, backgroundColor: "rgb(250, 250, 250)" }}>
          <InputLabel>Command</InputLabel>
          <Select
            label="Command"
            value={selectedItem}
            onChange={handleChange}
          >
            <MenuItem value={menuItems.getKeys}>{menuItems.getKeys}</MenuItem>
            <MenuItem value={menuItems.deleteAllKeys}>{menuItems.deleteAllKeys}</MenuItem>
            <MenuItem value={menuItems.deleteKey}>{menuItems.deleteKey}</MenuItem>
            <MenuItem value={menuItems.getTypeOfKey}>menuItems.getTypeOfKey</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleRunCommand} endIcon={<PlayArrowIcon />}>Run</Button>
      </Stack>
      <Box
        sx={{
          p: 3,
          backgroundColor: "rgb(250, 250, 250)",
          width: "100%",
        }}
      >
      </Box>
    </Box>
  );
}