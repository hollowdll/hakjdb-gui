import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  DialogContentText,
  Button,
} from "@mui/material";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useState, ChangeEvent } from "react";
import { ConnectionInfo } from "../../types/types";
import { tauriListenEvents } from "../../tauri/event";
import {
  allyPropsDialogTextField,
  allyPropsDialogContentText,
  allyPropsDialogActions,
} from "../../utility/props";

type ConnectionDialogProps = {
  handleConnect: (connectionInfo: ConnectionInfo) => void;
};

export function ConnectionDialog({ handleConnect }: ConnectionDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>({
    host: "localhost",
    port: 12345,
    defaultDb: "default"
  });

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleConnectClick = () => {
    console.log("trying to connect ...");
    handleConnect(connectionInfo);
    handleClose();
  };

  const inputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setConnectionInfo({
      ...connectionInfo,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    const unlisten = listen(tauriListenEvents.newConnection, (event) => {
      console.log("event ->", event.event);
      handleOpen();
    });

    return () => {
      unlisten.then((resolve) => resolve());
    };
  }, []);

  return (
    <>
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>New connection</DialogTitle>
        <DialogContent>
          <DialogContentText {...allyPropsDialogContentText()}>
            Connect to a new kvdb server instance.
          </DialogContentText>
          <TextField
            name= "host"
            label="Host or IP address"
            value={connectionInfo.host}
            onChange={inputChanged}
            {...allyPropsDialogTextField()}
          />
          <TextField
            name="port"
            label="Port number"
            value={connectionInfo.port}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const value = Number(event.target.value);
              if (value >= 0 && value <= 65535) setConnectionInfo({ ...connectionInfo, port: value });
            }}
            {...allyPropsDialogTextField()}
          />
          <TextField
            name= "defaultDb"
            label="Database To Use"
            value={connectionInfo.defaultDb}
            onChange={inputChanged}
            {...allyPropsDialogTextField()}
          />
        </DialogContent>
        <DialogActions {...allyPropsDialogActions()}>
          <Button variant="contained" onClick={handleConnectClick}>Connect</Button>
          <Button variant="outlined" onClick={handleClose} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
