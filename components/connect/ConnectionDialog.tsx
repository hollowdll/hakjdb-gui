'use client'

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
import { useEffect, useState } from "react";

type ConnectionDialogProps = {
  handleConnect: () => void,
}

export function ConnectionDialog({ handleConnect }: ConnectionDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleOpen = () => {
    setDialogOpen(true);
  }

  const handleConnectClick = () => {
    console.log("trying to connect ...");
    handleConnect();
    handleClose();
  }

  useEffect(() => {
    const unlisten = listen("new-connection", event => {
      console.log("event ->", event.event);
      handleOpen();
    })

    return () => {
      unlisten.then(resolve => resolve())
    }
  }, [])

  return (
    <>
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>New connection</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Connect to a new kvdb server instance.
          </DialogContentText>
          <TextField id="host" name="host" label="Host or IP address" fullWidth />
          <TextField id="port" name="port" label="Port number" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConnectClick}>Connect</Button>
          <Button onClick={handleClose} color="error">Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
