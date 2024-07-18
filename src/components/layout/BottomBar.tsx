import { Box, Typography } from "@mui/material";
import { useThemeStore } from "../../state/store";
import { appVersion } from "../../version";

export function BottomBar() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        paddingBottom: "5px",
        paddingTop: "5px",
        backgroundColor: isDarkMode ? "rgb(20,20,20)" : "rgb(255,255,255)",
      }}
    >
      <Typography sx={{ textAlign: "right", marginRight: "15px" }}>
        {appVersion}
      </Typography>
    </Box>
  );
}
