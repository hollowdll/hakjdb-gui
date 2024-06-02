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

type LogFilterDialogProps = {
  open: boolean,
  handleClose: () => void,
  filterType: "" | "head" | "tail",
  filterLogs: (logCount: number) => void,
}

export default function LogFilterDialog({open, handleClose, filterType, filterLogs}: LogFilterDialogProps) {
  const [logCount, setLogCount] = useState(0);

  const handleFilter = () => {
    handleClose();
    filterLogs(logCount);
  }

  return (
    <Dialog open={open} onClose={handleClose}>
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
  );
}