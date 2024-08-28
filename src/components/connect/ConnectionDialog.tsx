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
  SelectChangeEvent,
  Box,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FolderIcon from "@mui/icons-material/Folder";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useState, ChangeEvent } from "react";
import { ConnectionInfo } from "../../types/types";
import { tauriListenEvents } from "../../tauri/event";
import { invokeOpenFile, invokeSetTLSCertPath } from "../../tauri/command";
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
    tlsCertFilePath: "",
    isUsePassword: false,
    isUseTLS: false,
  });
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isTLSCertFileChosen, setIsTLSCertFileChosen] = useState(false);

  const handleChangeBooleanField = (event: SelectChangeEvent) => {
    setConnectionInfo({
      ...connectionInfo,
      [event.target.name]: event.target.value === "Yes" ? true : false,
    });
  };

  const handleClickShowPassword = () => setIsShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const handleClickOpenFile = () => {
    invokeOpenFile().then((result) => {
      if (result) {
        setConnectionInfo({
          ...connectionInfo,
          tlsCertFilePath: result,
        });
        setIsTLSCertFileChosen(true);
      }
    });
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleOpen = () => {
    setIsDialogOpen(true);
  };

  const handleConnectClick = async () => {
    console.log("trying to connect ...");
    connectionInfo.isUseTLS
      ? await invokeSetTLSCertPath(connectionInfo.tlsCertFilePath, false)
      : await invokeSetTLSCertPath("", true);
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
    <Box sx={{ display: "flex", flexDirection: "column" }}>
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
            label="Default Database"
            value={connectionInfo.defaultDb}
            onChange={inputChanged}
            {...allyPropsDialogTextField()}
          />
          <FormControl
            sx={{ marginTop: "15px", marginRight: "15px", minWidth: 125 }}
          >
            <InputLabel>Use Password</InputLabel>
            <Select
              name="isUsePassword"
              value={connectionInfo.isUsePassword ? "Yes" : "No"}
              label="Use Password"
              onChange={handleChangeBooleanField}
            >
              <MenuItem value="No">No</MenuItem>
              <MenuItem value="Yes">Yes</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ marginTop: "15px", minWidth: 125 }}>
            <InputLabel>Use TLS</InputLabel>
            <Select
              name="isUseTLS"
              value={connectionInfo.isUseTLS ? "Yes" : "No"}
              label="Use TLS"
              onChange={handleChangeBooleanField}
            >
              <MenuItem value="No">No</MenuItem>
              <MenuItem value="Yes">Yes</MenuItem>
            </Select>
          </FormControl>
          {connectionInfo.isUsePassword ? (
            <TextField
              name="password"
              label="Password"
              value={connectionInfo.password}
              onChange={inputChanged}
              type={isShowPassword ? "text" : "password"}
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
          ) : (
            <></>
          )}
          {connectionInfo.isUseTLS ? (
            <TextField
              disabled
              name="tlsCertFilePath"
              label="TLS certificate file path"
              value={
                isTLSCertFileChosen
                  ? connectionInfo.tlsCertFilePath
                  : "No file chosen"
              }
              onChange={inputChanged}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={handleClickOpenFile}
                      sx={{ "&:focus": { outline: "none" } }}
                    >
                      <FolderIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...allyPropsDialogTextField()}
            />
          ) : (
            <></>
          )}
        </DialogContent>
        <DialogActions {...allyPropsDialogActions()}>
          <Button variant="contained" onClick={handleConnectClick}>
            Connect
          </Button>
          <Button variant="outlined" onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
