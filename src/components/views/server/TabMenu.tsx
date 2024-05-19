import { Box, Tab, Tabs } from "@mui/material";
import { useState, SyntheticEvent } from "react";

export function TabMenu() {
  const [tabsValue, setTabsValue] = useState(0);

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  };

  return (
    <Box>
      <Tabs value={tabsValue} onChange={handleTabChange} aria-label="server view tab menu">
        <Tab label="Info" />
        <Tab label="Logs" />
      </Tabs>
    </Box>
  )
}
