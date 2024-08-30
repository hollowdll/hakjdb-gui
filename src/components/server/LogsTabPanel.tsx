import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import LogFilterDialog from "./LogFilterDialog";
import { errorAlert } from "../../utility/alert";
import { invokeGetServerLogs } from "../../tauri/command";
import { LogFilterType } from "../../types/server";
import { boxBackgroundColor } from "../../style";
import { useThemeStore } from "../../state/store";

export default function LogsTabPanel() {
  const [serverLogs, setServerLogs] = useState<string[] | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  const handleGetServerLogs = () => {
    invokeGetServerLogs()
      .then((result) => {
        setServerLogs(result.logs);
      })
      .catch((err) => {
        const errMsg = `Failed to show server logs: ${err}`;
        setErrorMsg(errMsg);
        setServerLogs(null);
        errorAlert(errMsg);
      })
      .finally(() => setIsLoading(false));
  };

  const handleFilterLogs = (logCount: number, filterType: LogFilterType) => {
    setIsLoading(true);
    invokeGetServerLogs()
      .then((result) => {
        if (filterType === "head")
          setServerLogs(result.logs.slice(0, logCount));
        else if (filterType === "tail")
          setServerLogs(result.logs.slice(-logCount));
        else setServerLogs([]);
      })
      .catch((err) => {
        setErrorMsg(`Failed to filter server logs: ${err}`);
        setServerLogs(null);
        errorAlert(err);
      })
      .finally(() => setIsLoading(false));
  };

  const renderLogs = () => {
    return serverLogs ? (
      <List>
        {serverLogs.map((item, index) => (
          <ListItem
            key={index}
            disablePadding
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "start",
            }}
          >
            <Typography sx={{ color: "text.secondary", marginRight: "20px" }}>
              {index + 1}
            </Typography>
            <Typography sx={{ wordBreak: "break-word" }}>{item}</Typography>
          </ListItem>
        ))}
      </List>
    ) : (
      <Typography>Something went wrong.</Typography>
    );
  };

  useEffect(() => {
    handleGetServerLogs();
  }, []);

  return (
    <Box>
      {serverLogs ? (
        <>
          <Stack
            spacing={2}
            direction="row"
            sx={{ marginTop: "10px", marginBottom: "10px" }}
          >
            <LogFilterDialog
              filterType={"head"}
              filterLogs={handleFilterLogs}
            />
            <LogFilterDialog
              filterType={"tail"}
              filterLogs={handleFilterLogs}
            />
          </Stack>
        </>
      ) : (
        <></>
      )}
      <Box
        sx={{
          p: 3,
          width: "100%",
          overflow: "auto",
          backgroundColor: boxBackgroundColor(isDarkMode),
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
