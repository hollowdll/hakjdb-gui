'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";

export function ConnectionDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleOpen = () => {
    setDialogOpen(true);
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
      </Dialog>
    </>
  )
}
