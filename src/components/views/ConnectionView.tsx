import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState, SyntheticEvent } from "react";
import { useConnectionInfoStore } from "../../state/store";

export default function ConnectionView() {
  const [accordionExpanded, setAccordionExpanded] = useState<string | false>(
    false
  );
  const connectionInfo = useConnectionInfoStore((state) => state.connectionInfo);

  const handleAccordionChange =
    (panel: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
      setAccordionExpanded(isExpanded ? panel : false);
    };

  function allyPropsConnectionValue(field: string) {
    return {
      id: `connection-value-${field}`,
      sx: { marginLeft: "50px", marginRight: "30px", color: "text.secondary", wordBreak: "break-word" },
    };
  }

  return (
    <Box sx={{ width: "100%" }}>
      <h1>Connection</h1>
      <Box sx={{ paddingTop: "1em" }}>
        <Accordion
          expanded={accordionExpanded === "panel1"}
          onChange={handleAccordionChange("panel1")}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{}}>Host</Typography>
            <Typography {...allyPropsConnectionValue("host")}>{connectionInfo.host}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Server's address to connect to. Can be hostname or IP address.</Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={accordionExpanded === "panel2"}
          onChange={handleAccordionChange("panel2")}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography >Port</Typography>
            <Typography {...allyPropsConnectionValue("port")}>{connectionInfo.port}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Server's TCP/IP port. Ranges from 1 to 65535.</Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}
