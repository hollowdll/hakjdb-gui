import { Box, Typography } from "@mui/material";
import TabMenu from "../keys/TabMenu";

export default function KeysView() {
  return (
    <Box sx={{ width: "100%" }}>
      <h1>Keys</h1>
      <Typography sx={{ marginBottom: "15px" }}>Manage keys using RPCs.</Typography>
      <TabMenu />
    </Box>
  );
}
