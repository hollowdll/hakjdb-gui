import { Box, CircularProgress } from "@mui/material";
import { useServerInfoStore } from "../../state/store";

export default function InfoPanel() {
  const serverInfo = useServerInfoStore((state) => state.serverInfo);

  return (
    <>
      <Box sx={{ p: 3, backgroundColor: "rgb(250, 250, 250)", width: "100%" }}>
        {serverInfo ? `${serverInfo}` : <CircularProgress />}
      </Box>
    </>
  );
}
