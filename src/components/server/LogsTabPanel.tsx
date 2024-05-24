import { useEffect, useState } from "react";
import { ServerLogs } from "../../types/server";
import { invoke } from "@tauri-apps/api";
import toast from "react-hot-toast";
import { Box, Button, CircularProgress, List, ListItem, Stack, Typography } from "@mui/material";
import LogFilterDialog from "./LogFilterDialog";

export default function LogsTabPanel() {
  const [serverLogs, setServerLogs] = useState<ServerLogs | null>(null);
  const [filteredLogs, setFilteredLogs] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedFilterType, setSelectedFilterType] = useState<"" | "head" | "tail">("");

  const handleCloseFilterDialog = () => {
    setFilterDialogOpen(false);
  }

  const handleOpenFilterDialog = () => {
    setFilterDialogOpen(true);
  }

  const handleOpenFilter = (filterType: "head" | "tail") => {
    setSelectedFilterType(filterType);
    handleOpenFilterDialog();
  }

  const handleGetServerLogs = () => {
    invoke<ServerLogs>("get_server_logs")
    .then(result => {
      setServerLogs(result);
      setFilteredLogs(result.logs);
    })
    .catch(err => {
      setErrorMsg(`Failed to show server logs: ${err}`);
      toast.error(err, {duration: 5000});
    })
    .finally(() => setIsLoading(false));
  }

  const handleFilterHead = (logCount: number) => {
    if (serverLogs) setFilteredLogs(serverLogs.logs.slice(0, logCount));
  }

  const handleFilterTail = (logCount: number) => {
    if (serverLogs) setFilteredLogs(serverLogs.logs.slice(-logCount));
  }

  const handleFilterLogs = (logCount: number) => {
    if (serverLogs) {
      if (selectedFilterType === "head") setFilteredLogs(serverLogs.logs.slice(0, logCount))
        else if (selectedFilterType === "tail") setFilteredLogs(serverLogs.logs.slice(-logCount));
    }
  }

  const renderLogs = () => {
    return (
      <List>
        {filteredLogs.map((log, index) => (
          <ListItem key={index} disablePadding sx={{display: "flex", justifyContent: "start", alignItems: "start"}}>
            <Typography sx={{color: "text.secondary", marginRight: "20px"}}>{index + 1}</Typography>
            <Typography>{log}</Typography>
          </ListItem>
        ))}
      </List>
    );
  };

  useEffect(() => {
    handleGetServerLogs();
  }, [])

  return (
    <Box>
      {serverLogs ? (
        <>
          <Stack spacing={2} direction="row" sx={{marginTop: "10px", marginBottom: "10px"}}>
            <Button variant="contained" onClick={() => handleOpenFilter("head")}>Filter Head</Button>
            <Button variant="contained" onClick={() => handleOpenFilter("tail")}>Filter Tail</Button>
          </Stack>
          <LogFilterDialog open={filterDialogOpen} handleClose={handleCloseFilterDialog} filterType={selectedFilterType} filterLogs={handleFilterLogs} />
        </>
      ) : (<></>)}
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
    </Box>
  );
}
