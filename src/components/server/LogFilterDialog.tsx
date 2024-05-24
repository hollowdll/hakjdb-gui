import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Button } from "@mui/material";
import { useState, ChangeEvent } from "react";

type LogFilterDialogProps = {
  open: boolean,
  handleClose: () => void,
  filterType: "" | "head" | "tail",
  filterLogs: (logCount: number) => void,
}

export default function LogFilterDialog({open, handleClose, filterType, filterLogs}: LogFilterDialogProps) {
  const [logCount, setLogCount] = useState(0);

  const handleFilter = () => {
    filterLogs(logCount);
    handleClose();
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Filter Logs</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {filterType === "head" ? "Display only the first N logs." : filterType === "tail" ? "Display only the last N logs." : ""}
        </DialogContentText>
        <TextField
          label="Number of logs"
          value={logCount}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const value = Number(event.target.value);
            if (value >= 0) setLogCount(value);
          }}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose} color="error">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleFilter}>Filter</Button>
      </DialogActions>
    </Dialog>
  );
}