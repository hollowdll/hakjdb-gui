import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, List, ListItem, Stack, Typography } from "@mui/material";
import LogFilterDialog from "./LogFilterDialog";
import { errorAlert } from "../../utility/alert";
import { invokeGetServerLogs } from "../../tauri/command";

export default function LogsTabPanel() {
  const [serverLogs, setServerLogs] = useState<string[] | null>(null);
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
    invokeGetServerLogs()
      .then((result) => {
        setServerLogs(result.logs);
      })
      .catch((err) => {
        setErrorMsg(`Failed to show server logs: ${err}`);
        setServerLogs(null);
        errorAlert(err);
      })
      .finally(() => setIsLoading(false));
  };

  const handleFilterLogs = (logCount: number) => {
    setIsLoading(true);
    invokeGetServerLogs()
      .then(result => {
        if (selectedFilterType === "head") setServerLogs(result.logs.slice(0, logCount))
          else if (selectedFilterType === "tail") setServerLogs(result.logs.slice(-logCount));
          else setServerLogs([]);
      })
      .catch(err => {
        setErrorMsg(`Failed to filter server logs: ${err}`);
        setServerLogs(null);
        errorAlert(err);
      })
      .finally(() => setIsLoading(false));
  }

  const renderLogs = () => {
    return serverLogs ? (
      <List>
        {serverLogs.map((log, index) => (
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
