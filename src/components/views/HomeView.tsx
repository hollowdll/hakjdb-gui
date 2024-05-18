import { Box } from "@mui/material";

export default function HomeView() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: "50%",
          bottom: "50%",
        }}
      >
        <h1>Not connected to a kvdb server.</h1>
        <h1>Start by connecting to a kvdb server.</h1>
      </Box>
    </Box>
  );
}
