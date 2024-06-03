import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState, SyntheticEvent } from "react";

function allyProps() {
  return {
    sx: {'&:focus': {outline: 'none'}},
  };
}

export default function TabMenu() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{width: "100%"}}>
      <Box>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Overview" {...allyProps()} />
          <Tab label="String" {...allyProps()} />
          <Tab label="HashMap" {...allyProps()} />
        </Tabs>
      </Box>
      {tabValue === 0 && <Typography>Overview</Typography>}
      {tabValue === 1 && <Typography>String</Typography>}
      {tabValue === 2 && <Typography>HashMap</Typography>}
    </Box>
  )
}