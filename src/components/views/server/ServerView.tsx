import { Box, Typography } from "@mui/material";
import TabMenu from "../../server/TabMenu";

export default function ServerView() {
  return (
    <Box sx={{ width: "100%" }}>
      <h1>Server</h1>
      <Typography sx={{ marginBottom: "15px" }}>View server information and logs.</Typography>
      <TabMenu />
    </Box>
  );
}
