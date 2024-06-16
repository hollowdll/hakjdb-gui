import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState, SyntheticEvent } from "react";
import GeneralTabPanel from "./GeneralTabPanel";
import StringTabPanel from "./StringTabPanel";
import HashMapTabPanel from "./HashMapTabPanel";

function allyProps() {
  return {
    sx: { "&:focus": { outline: "none" } },
  };
}

export default function TabMenu() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="General" {...allyProps()} />
          <Tab label="String" {...allyProps()} />
          <Tab label="HashMap" {...allyProps()} />
        </Tabs>
      </Box>
      {tabValue === 0 && <GeneralTabPanel />}
      {tabValue === 1 && <StringTabPanel />}
      {tabValue === 2 && <HashMapTabPanel />}
    </Box>
  );
}
