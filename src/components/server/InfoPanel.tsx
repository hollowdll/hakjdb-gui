import { Box, CircularProgress, List, ListItem, ListItemText, ListSubheader } from "@mui/material";
import { useServerInfoStore } from "../../state/store";
import { MemoryInfo } from "../../types/server";

type MemoryInfoListProps = {
  info: MemoryInfo,
}

function MemoryInfoList({info}: MemoryInfoListProps) {
  return (
    <List sx={{width: "100%"}}>
      <h3>Memory</h3>
      <ListItem>
        <ListItemText primary="memory_alloc" />
        <ListItemText sx={{textAlign: "end"}} primary={`${Number(info.memoryAllocMegaByte).toFixed(1)} MB`} />
      </ListItem>
      <ListItem>
        <ListItemText primary="memory_total_alloc" />
        <ListItemText sx={{textAlign: "end"}} primary={`${Number(info.memoryTotalAllocMegaByte).toFixed(1)} MB`} />
      </ListItem>
      <ListItem>
        <ListItemText primary="memory_sys" />
        <ListItemText sx={{textAlign: "end"}} primary={`${Number(info.memorySysMegaByte).toFixed(1)} MB`} />
      </ListItem>
    </List>
  );
}

export default function InfoPanel() {
  const serverInfo = useServerInfoStore((state) => state.serverInfo);

  return (
    <>
      <Box sx={{ p: 3, backgroundColor: "rgb(250, 250, 250)", width: "100%" }}>
        {serverInfo ? <MemoryInfoList info={serverInfo.memoryInfo} /> : <CircularProgress />}
      </Box>
    </>
  );
}
