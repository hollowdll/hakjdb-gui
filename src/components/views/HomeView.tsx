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
          textWrap: "nowrap",
          left: "50%",
          right: "50%",
        }}
      >
        <h1>Not connected to a HakjDB server.</h1>
        <h1>Go to Connect ➡  New Connection</h1>
      </Box>
    </Box>
  );
}
