import { useState, ChangeEvent } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import {
  allyPropsDialogTextField,
  allyPropsDialogContentText,
  allyPropsDialogActions,
} from "../../utility/props";
import { LogFilterType } from "../../types/server";

type LogFilterDialogProps = {
  filterType: LogFilterType
  filterLogs: (logCount: number, filterType: LogFilterType) => void,
}

export default function LogFilterDialog({filterType, filterLogs}: LogFilterDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [logCount, setLogCount] = useState(0);

  const handleOpen = () => {
    setIsOpen(true);
  }

  const handleClose = () => {
    setIsOpen(false);
  }

  const handleFilter = () => {
    handleClose();
    filterLogs(logCount, filterType);
  }

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>Filter {filterType}</Button>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Filter Logs</DialogTitle>
        <DialogContent>
          <DialogContentText {...allyPropsDialogContentText()}>
            {filterType === "head" ? "Display only the first N logs." : filterType === "tail" ? "Display only the last N logs." : ""}
          </DialogContentText>
          <TextField
            label="Number of logs"
            value={logCount}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const value = Number(event.target.value);
              if (value >= 0) setLogCount(value);
            }}
            {...allyPropsDialogTextField()}
          />
        </DialogContent>
        <DialogActions {...allyPropsDialogActions()}>
          <Button variant="contained" onClick={handleFilter}>Filter</Button>
          <Button variant="outlined" onClick={handleClose} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}