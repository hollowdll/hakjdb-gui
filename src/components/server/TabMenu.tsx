import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState, SyntheticEvent } from "react";
import InfoPanel from "./InfoPanel";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`server-tabpanel-${index}`}
      aria-labelledby={`server-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3, backgroundColor: 'rgb(250, 250, 250)', width: '100%' }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function allyProps(index: number) {
  return {
    id: `server-tab-${index}`,
    'aria-controls': `server-tabpanel-${index}`,
    sx: {'&:focus': {outline: 'none'}},
  };
}

export default function TabMenu() {
  const [tabsValue, setTabsValue] = useState(0);

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  };

  return (
    <Box sx={{width: "100%"}}>
      <Box>
        <Tabs value={tabsValue} onChange={handleTabChange} aria-label="server view tab menu">
          <Tab label="Info" {...allyProps(0)} />
          <Tab label="Logs" {...allyProps(1)} />
        </Tabs>
      </Box>
      {tabsValue === 0 && <InfoPanel />}
      <CustomTabPanel value={tabsValue} index={0}>
        Item One
      </CustomTabPanel>
      <CustomTabPanel value={tabsValue} index={1}>
        Item Two
      </CustomTabPanel>
    </Box>
  )
}
