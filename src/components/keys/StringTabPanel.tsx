import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack } from "@mui/material";
import { useState } from "react";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export default function StringTabPanel() {
  const [selectedCommand, setSelectedCommand] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedCommand(event.target.value as string);
  }

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ marginTop: "20px", marginBottom: "10px" }}>
        <FormControl variant="outlined" sx={{ m: 1, minWidth: 150, backgroundColor: "rgb(250, 250, 250)" }}>
          <InputLabel>Command</InputLabel>
          <Select
            label="Command"
            value={selectedCommand}
            onChange={handleChange}
          >
            <MenuItem value={"Set"}>Set</MenuItem>
            <MenuItem value={"Get"}>Get</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" endIcon={<PlayArrowIcon />}>Run</Button>
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