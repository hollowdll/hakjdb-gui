import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState, SyntheticEvent } from "react";
import { useConnectionInfoStore } from "../../state/store";

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
  const connectionInfo = useConnectionInfoStore(
    (state) => state.connectionInfo,
  );

  const handleAccordionChange =
    (panel: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
      setAccordionExpanded(isExpanded ? panel : false);
    };

  return (
    <Box sx={{ width: "100%" }}>
      <h1>Connection</h1>
      <Box sx={{ paddingTop: "1em" }}>
        <Accordion
          expanded={accordionExpanded === "panel1"}
          onChange={handleAccordionChange("panel1")}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <ListItemText primary="Database To Use" {...allyPropsField()} />
            <ListItemText
              primary={connectionInfo.defaultDb}
              {...allyPropsValue()}
            />
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Commands in Keys view use this database by default.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}
