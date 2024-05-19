import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState, SyntheticEvent } from "react";

export default function ConnectionView() {
  const [accordionExpanded, setAccordionExpanded] = useState<string | false>(
    false
  );

  const handleAccordionChange =
    (panel: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
      setAccordionExpanded(isExpanded ? panel : false);
    };

  return (
    <Box>
      <h1>Connection</h1>
      <Box sx={{ paddingTop: "1em" }}>
        <Accordion
          expanded={accordionExpanded === "panel1"}
          onChange={handleAccordionChange("panel1")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography sx={{ width: "33%", flexShrink: 0 }}>Host</Typography>
            <Typography sx={{ color: "text.secondary" }}>host or IP</Typography>
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
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            <Typography sx={{ width: "33%", flexShrink: 0 }}>Port</Typography>
            <Typography sx={{ color: "text.secondary" }}>port number</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Server's TCP/IP port. Ranges from 1 to 65535.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}
