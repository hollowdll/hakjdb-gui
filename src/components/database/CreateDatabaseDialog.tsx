"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useState, ChangeEvent } from "react";
import { invokeCreateDatabase } from "../../tauri/command";
import { successAlert } from "../../utility/alert";
import { useDatabaseStore } from "../../state/store";
import { invokeGetAllDatabases } from "../../tauri/command";
import { errorAlert } from "../../utility/alert";

export default function CreateDatabaseDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dbName, setDbName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const setDatabases = useDatabaseStore((state) => state.setDatabases);

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const resetForm = () => {
    setDbName("");
    setErrorMsg("");
  }

  const handleGetAllDatabases = () => {
    invokeGetAllDatabases()
      .then((result) => {
        setDatabases(result.dbNames);
      })
      .catch((err) => {
        errorAlert(`Failed to show databases: ${err}`);
      })
  };

  const handleCreateDb = () => {
    setIsLoading(true);
    invokeCreateDatabase(dbName)
      .then((result) => {
        setDialogOpen(false);
        successAlert(`Created database: ${result}`);
        resetForm();
      })
      .catch((err) => {
        setErrorMsg(`Failed to create database: ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
        handleGetAllDatabases();
      });
  }

  const inputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setDbName(event.target.value);
  };

  return (
    <>
      <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>New</Button>
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Create a new database</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={dbName}
            onChange={inputChanged}
            fullWidth
            sx={{marginTop: "10px"}}
          />
          {errorMsg !== "" ? (
            <Typography sx={{marginTop: "15px"}}>{errorMsg}</Typography>
          ) : <></>}
        </DialogContent>
        <DialogActions sx={{m: "5px"}}>
          <Button variant="contained" onClick={handleCreateDb}>Create</Button>
          <Button variant="outlined" onClick={handleClose} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}