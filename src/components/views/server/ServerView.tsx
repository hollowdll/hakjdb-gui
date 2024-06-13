import { Box } from "@mui/material";
import TabMenu from "../../server/TabMenu";

export default function ServerView() {
  return (
    <Box sx={{ width: "100%" }}>
      <h1>Server</h1>
      <TabMenu />
    </Box>
  );
}
