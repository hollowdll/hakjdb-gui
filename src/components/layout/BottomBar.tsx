import { Box, Typography } from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import SignalWifiBadIcon from "@mui/icons-material/SignalWifiBad";
import { useThemeStore } from "../../state/store";
import { useConnectionInfoStore } from "../../state/store";
import { appVersion } from "../../version";

export function BottomBar() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const isConnected = useConnectionInfoStore((state) => state.isConnected);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        paddingBottom: "3px",
        paddingTop: "3px",
        backgroundColor: isDarkMode ? "rgb(20,20,20)" : "rgb(255,255,255)",
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", marginRight: "40px" }}>
        {isConnected ? <WifiIcon /> : <SignalWifiBadIcon />}
        <Typography sx={{ marginLeft: "5px" }}>
          Status: {isConnected ? "Connected" : "Not Connected"}
        </Typography>
      </Box>
      <Typography sx={{ textAlign: "right", marginRight: "15px" }}>
        {appVersion}
      </Typography>
    </Box>
  );
}
