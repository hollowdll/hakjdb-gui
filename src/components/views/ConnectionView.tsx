import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  ListItemText,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState, SyntheticEvent } from "react";
import { useConnectionInfoStore } from "../../state/store";
import { allyPropsAccordionSummary } from "../../utility/props";
import { invokeUnaryEcho } from "../../tauri/command";
import { errorAlert, successAlert } from "../../utility/alert";

function allyPropsField() {
  return {
    sx: { marginRight: "80px" },
  };
}

function allyPropsValue() {
  return {
    sx: {
      marginRight: "50px",
      textAlign: "end",
      color: "text.secondary",
      wordBreak: "break-word",
    },
  };
}

export default function ConnectionView() {
  const [accordionExpanded, setAccordionExpanded] = useState<string | false>(
    false,
  );
  const [isShowPassword, setIsShowPassword] = useState(false);
  const connectionInfo = useConnectionInfoStore(
    (state) => state.connectionInfo,
  );

  const handleAccordionChange =
    (panel: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
      setAccordionExpanded(isExpanded ? panel : false);
    };

  const handleClickShowPassword = () => setIsShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const testConnection = () => {
    invokeUnaryEcho("")
      .then(() => {
        successAlert("Connection is working");
      })
      .catch((err) => {
        errorAlert(`Connection failed: ${err}`);
      });
  };

  return (
    <Box sx={{ width: "100%" }}>
      <h1>Connection</h1>
      <Typography sx={{ marginBottom: "15px" }}>
        Connection settings currently being used.
      </Typography>
      <Button
        variant="contained"
        onClick={testConnection}
        sx={{ marginTop: "5px" }}
      >
        Test Connection
      </Button>
      <Box sx={{ paddingTop: "1em" }}>
        <Accordion
          expanded={accordionExpanded === "panel1"}
          onChange={handleAccordionChange("panel1")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            {...allyPropsAccordionSummary()}
          >
            <ListItemText primary="Host" {...allyPropsField()} />
            <ListItemText primary={connectionInfo.host} {...allyPropsValue()} />
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Server's address to connect to. Can be hostname or IP address.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={accordionExpanded === "panel2"}
          onChange={handleAccordionChange("panel2")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            {...allyPropsAccordionSummary()}
          >
            <ListItemText primary="Port" {...allyPropsField()} />
            <ListItemText primary={connectionInfo.port} {...allyPropsValue()} />
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Server's TCP/IP port. Ranges from 1 to 65535.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={accordionExpanded === "panel3"}
          onChange={handleAccordionChange("panel3")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            {...allyPropsAccordionSummary()}
          >
            <ListItemText primary="Default Database" {...allyPropsField()} />
            <ListItemText
              primary={connectionInfo.defaultDb}
              {...allyPropsValue()}
            />
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              RPCs in Keys view use this database as the default database.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={accordionExpanded === "panel4"}
          onChange={handleAccordionChange("panel4")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            {...allyPropsAccordionSummary()}
          >
            <ListItemText primary="Using Password" {...allyPropsField()} />
            <ListItemText
              primary={connectionInfo.usePassword ? "Yes" : "No"}
              {...allyPropsValue()}
            />
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              If password is used for the connection. Password is needed to
              access password protected servers.
            </Typography>
            {connectionInfo.usePassword ? (
              <>
                <Divider sx={{ marginTop: "10px", marginBottom: "10px" }} />
                <Box sx={{ display: "flex" }}>
                  <ListItemText primary="Password" {...allyPropsField()} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "center",
                      color: "text.secondary",
                      wordBreak: "break-word",
                    }}
                  >
                    <Typography sx={{ marginRight: "5px" }}>
                      {isShowPassword
                        ? connectionInfo.password
                        : "*".repeat(connectionInfo.password.length)}
                    </Typography>
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {isShowPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </Box>
                </Box>
              </>
            ) : (
              <></>
            )}
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={accordionExpanded === "panel5"}
          onChange={handleAccordionChange("panel5")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            {...allyPropsAccordionSummary()}
          >
            <ListItemText primary="Using TLS" {...allyPropsField()} />
            <ListItemText
              primary={connectionInfo.useTLS ? "Yes" : "No"}
              {...allyPropsValue()}
            />
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              If TLS is used for the connection. TLS is needed to access TLS
              enabled servers for secure communication.
            </Typography>
            {connectionInfo.useTLS ? (
              <>
                <Divider sx={{ marginTop: "10px", marginBottom: "10px" }} />
                <Box sx={{ display: "flex" }}>
                  <ListItemText
                    primary="Certification path"
                    {...allyPropsField()}
                  />
                  <ListItemText
                    primary={connectionInfo.caCertFilePath}
                    sx={{
                      textAlign: "end",
                      color: "text.secondary",
                      wordBreak: "break-word",
                    }}
                  />
                </Box>
              </>
            ) : (
              <></>
            )}
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}
