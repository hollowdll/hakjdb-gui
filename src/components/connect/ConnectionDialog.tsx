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
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FolderIcon from "@mui/icons-material/Folder";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useState, ChangeEvent } from "react";
import { ConnectionInfo } from "../../types/types";
import { tauriListenEvents } from "../../tauri/event";
import {
  invokeOpenFile,
  invokeSetTLSCACert,
  invokeSetTLSClientCertAuth,
} from "../../tauri/command";
import {
  allyPropsDialogTextField,
  allyPropsDialogContentText,
  allyPropsDialogActions,
} from "../../utility/props";

type ConnectionDialogProps = {
  handleConnect: (connectionInfo: ConnectionInfo) => Promise<string>;
};

type FilesChosen = {
  caCert: boolean;
  clientCert: boolean;
  clientKey: boolean;
};

export function ConnectionDialog({ handleConnect }: ConnectionDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>({
    host: "localhost",
    port: 12345,
    defaultDb: "default",
    password: "",
    caCertFilePath: "",
    clientCertFilePath: "",
    clientKeyFilePath: "",
    usePassword: false,
    useTLS: false,
    useClientCertAuth: false,
  });
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [filesChosen, setFilesChosen] = useState<FilesChosen>({
    caCert: false,
    clientCert: false,
    clientKey: false,
  });
  const [errorMsg, setErrorMsg] = useState("");

  const handleChangeBooleanField = (event: SelectChangeEvent) => {
    setConnectionInfo({
      ...connectionInfo,
      [event.target.name]: event.target.value === "Yes" ? true : false,
    });
  };

  const handleChangeUseTLS = (event: SelectChangeEvent) => {
    if (event.target.value === "No") {
      setConnectionInfo({
        ...connectionInfo,
        useTLS: false,
        useClientCertAuth: false,
      });
    } else if (event.target.value === "Server Side") {
      setConnectionInfo({
        ...connectionInfo,
        useTLS: true,
        useClientCertAuth: false,
      });
    } else if (event.target.value === "Client Certificate Authentication") {
      setConnectionInfo({
        ...connectionInfo,
        useTLS: true,
        useClientCertAuth: true,
      });
    }
  };

  const handleClickShowPassword = () => setIsShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const handleClickOpenFile = (file: "caCert" | "clientCert" | "clientKey") => {
    invokeOpenFile().then((result) => {
      if (result) {
        if (file == "caCert") {
          setConnectionInfo({
            ...connectionInfo,
            caCertFilePath: result,
          });
          setFilesChosen({ ...filesChosen, caCert: true });
        } else if (file == "clientCert") {
          setConnectionInfo({
            ...connectionInfo,
            clientCertFilePath: result,
          });
          setFilesChosen({ ...filesChosen, clientCert: true });
        } else if (file == "clientKey") {
          setConnectionInfo({
            ...connectionInfo,
            clientKeyFilePath: result,
          });
          setFilesChosen({ ...filesChosen, clientKey: true });
        }
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

    if (connectionInfo.useTLS) {
      await invokeSetTLSCACert(false, connectionInfo.caCertFilePath);
      if (connectionInfo.useClientCertAuth) {
        await invokeSetTLSClientCertAuth(
          false,
          connectionInfo.clientCertFilePath,
          connectionInfo.clientKeyFilePath,
        );
      } else {
        invokeSetTLSClientCertAuth(true, "", "");
      }
    } else {
      await invokeSetTLSCACert(true, "");
    }

    const errMsg = await handleConnect(connectionInfo);
    if (errMsg != "") {
      setErrorMsg(errMsg);
    } else {
      handleClose();
      setErrorMsg("");
    }
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
            Connect to a HakjDB server instance.
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
              name="usePassword"
              value={connectionInfo.usePassword ? "Yes" : "No"}
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
              name="useTLS"
              value={
                connectionInfo.useTLS && !connectionInfo.useClientCertAuth
                  ? "Server Side"
                  : connectionInfo.useTLS && connectionInfo.useClientCertAuth
                    ? "Client Certificate Authentication"
                    : "No"
              }
              label="Use TLS"
              onChange={handleChangeUseTLS}
            >
              <MenuItem value="No">No</MenuItem>
              <MenuItem value="Server Side">Server Side</MenuItem>
              <MenuItem value="Client Certificate Authentication">
                Client Certificate Authentication
              </MenuItem>
            </Select>
          </FormControl>
          {connectionInfo.usePassword ? (
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
          {connectionInfo.useTLS ? (
            <TextField
              disabled
              name="caCertFilePath"
              label="CA Certificate File"
              value={
                filesChosen.caCert
                  ? connectionInfo.caCertFilePath
                  : "No File Chosen"
              }
              onChange={inputChanged}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => handleClickOpenFile("caCert")}
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
          {connectionInfo.useClientCertAuth ? (
            <>
              <TextField
                disabled
                name="clientCertFilePath"
                label="Client Certificate File"
                value={
                  filesChosen.clientCert
                    ? connectionInfo.clientCertFilePath
                    : "No File Chosen"
                }
                onChange={inputChanged}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => handleClickOpenFile("clientCert")}
                        sx={{ "&:focus": { outline: "none" } }}
                      >
                        <FolderIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...allyPropsDialogTextField()}
              />
              <TextField
                disabled
                name="clientKeyFilePath"
                label="Client Private Key File"
                value={
                  filesChosen.clientKey
                    ? connectionInfo.clientKeyFilePath
                    : "No File Chosen"
                }
                onChange={inputChanged}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => handleClickOpenFile("clientKey")}
                        sx={{ "&:focus": { outline: "none" } }}
                      >
                        <FolderIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...allyPropsDialogTextField()}
              />
            </>
          ) : (
            <></>
          )}
          {errorMsg !== "" ? (
            <Typography sx={{ marginTop: "15px" }}>{errorMsg}</Typography>
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
