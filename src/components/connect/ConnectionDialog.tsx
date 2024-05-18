"use client";

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

type ConnectionDialogProps = {
  handleConnect: (connectionInfo: ConnectionInfo) => void;
};

export function ConnectionDialog({ handleConnect }: ConnectionDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>({
    host: "localhost",
    port: 12345,
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
    const unlisten = listen("new-connection", (event) => {
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
          <DialogContentText>
            Connect to a new kvdb server instance.
          </DialogContentText>
          <TextField
            id="host"
            name="host"
            label="Host or IP address"
            value={connectionInfo.host}
            onChange={inputChanged}
            fullWidth
          />
          <TextField
            id="port"
            name="port"
            label="Port number"
            value={connectionInfo.port}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const value = Number(event.target.value);
              if (value >= 0 && value <= 65535) setConnectionInfo({ ...connectionInfo, port: value });
            }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConnectClick}>Connect</Button>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
