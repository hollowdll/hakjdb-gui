import { useEffect, useState } from "react";
import { ServerLogs } from "../../types/server";
import { invoke } from "@tauri-apps/api";
import toast from "react-hot-toast";
import { Box, CircularProgress, List, ListItem, Typography } from "@mui/material";

export default function LogsTabPanel() {
  const [serverLogs, setServerLogs] = useState<ServerLogs | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleGetServerLogs = () => {
    invoke<ServerLogs>("get_server_logs")
    .then(result => {
      setServerLogs(result);
    })
    .catch(err => {
      setServerLogs(null);
      setErrorMsg(`Failed to show server logs: ${err}`);
      toast.error(err, {duration: 5000});
    })
    .finally(() => setIsLoading(false));
  }

  const renderLogs = () => {
    return serverLogs ? (
      <List>
        {serverLogs.logs.map((log, index) => (
          <ListItem key={index} disablePadding sx={{display: "flex", justifyContent: "start", alignItems: "start"}}>
            <Typography sx={{color: "text.secondary", marginRight: "20px"}}>{index + 1}</Typography>
            <Typography>{log}</Typography>
          </ListItem>
        ))}
      </List>
    ) : (
      <Typography>Something went wrong.</Typography>
    );
  };

  useEffect(() => {
    handleGetServerLogs();
  }, [])

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: "rgb(250, 250, 250)",
        width: "100%",
        overflow: "auto",
      }}
    >
      {isLoading ? (
        <CircularProgress />
      ) : serverLogs ? (
        <>{renderLogs()}</>
      ) : errorMsg !== "" ? (
        <Typography>{errorMsg}</Typography>
      ) : (
        <></>
      )}
    </Box>
  );
}
