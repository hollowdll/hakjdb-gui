import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  DialogContentText,
  Button,
  InputAdornment,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>({
    host: "localhost",
    port: 12345,
    defaultDb: "default",
    password: "",
  });
  const [isUsePassword, setIsUsePassword] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const handleChangeUsePassword = (event: SelectChangeEvent) => {
    setIsUsePassword(event.target.value === 'Yes' ? true : false);
  }

  const handleClickShowPassword = () => setIsShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleOpen = () => {
    setIsDialogOpen(true);
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
      <Dialog open={isDialogOpen} onClose={handleClose}>
        <DialogTitle>New connection</DialogTitle>
        <DialogContent>
          <DialogContentText {...allyPropsDialogContentText()}>
            Connect to a new kvdb server instance.
          </DialogContentText>
          <TextField
            name="host"
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
              if (value >= 0 && value <= 65535)
                setConnectionInfo({ ...connectionInfo, port: value });
            }}
            {...allyPropsDialogTextField()}
          />
          <TextField
            name="defaultDb"
            label="Database To Use"
            value={connectionInfo.defaultDb}
            onChange={inputChanged}
            {...allyPropsDialogTextField()}
          />
          <FormControl sx={{ marginTop: '15px', minWidth: 125 }}>
            <InputLabel>Use Password</InputLabel>
            <Select
              value={isUsePassword ? 'Yes' : 'No'}
              label="Use Password"
              onChange={handleChangeUsePassword}
            >
              <MenuItem value='No'>No</MenuItem>
              <MenuItem value='Yes'>Yes</MenuItem>
            </Select>
          </FormControl>
          {isUsePassword ? (
            <TextField
              name="password"
              label="Password"
              value={connectionInfo.password}
              onChange={inputChanged}
              type={isShowPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      sx={{ "&:focus": { outline: "none" } }}
                    >
                      {isShowPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...allyPropsDialogTextField()}
            />
          ) : (<></>)}
        </DialogContent>
        <DialogActions {...allyPropsDialogActions()}>
          <Button variant="contained" onClick={handleConnectClick}>
            Connect
          </Button>
          <Button variant="outlined" onClick={handleClose} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
