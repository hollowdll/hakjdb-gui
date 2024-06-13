import { Box, Tab, Tabs } from "@mui/material";
import { useState, SyntheticEvent } from "react";
import InfoTabPanel from "./InfoTabPanel";
import LogsTabPanel from "./LogsTabPanel";

function allyProps(index: number) {
  return {
    id: `server-tab-${index}`,
    "aria-controls": `server-tabpanel-${index}`,
    sx: { "&:focus": { outline: "none" } },
  };
}

export default function TabMenu() {
  const [tabsValue, setTabsValue] = useState(0);

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box>
        <Tabs
          value={tabsValue}
          onChange={handleTabChange}
          aria-label="server view tab menu"
        >
          <Tab label="Info" {...allyProps(0)} />
          <Tab label="Logs" {...allyProps(1)} />
        </Tabs>
      </Box>
      {tabsValue === 0 && <InfoTabPanel />}
      {tabsValue === 1 && <LogsTabPanel />}
    </Box>
  );
}
