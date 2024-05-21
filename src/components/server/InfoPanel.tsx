import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { useServerInfoStore } from "../../state/store";
import { MemoryInfo, StorageInfo } from "../../types/server";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState, SyntheticEvent } from "react";

type MemoryInfoListProps = {
  info: MemoryInfo;
};

type StorageInfoListProps = {
  info: StorageInfo;
};

function allyPropsInfoValue(infoField: string) {
  return {
    id: `server-info-value-${infoField}`,
    'aria-controls': `server-info-value-${infoField}`,
    sx: { textAlign: "center", color: "text.secondary" },
  };
}

function MemoryInfoList({ info }: MemoryInfoListProps) {
  return (
    <List sx={{ width: "100%" }}>
      <h3>Memory</h3>
      <ListItem>
        <ListItemText primary="memory_alloc" />
        <ListItemText
          sx={{ textAlign: "end", color: "text.secondary" }}
          primary={`${Number(info.memoryAllocMegaByte).toFixed(1)} MB`}
        />
      </ListItem>
      <ListItem>
        <ListItemText primary="memory_total_alloc" />
        <ListItemText
          sx={{ textAlign: "end", color: "text.secondary" }}
          primary={`${Number(info.memoryTotalAllocMegaByte).toFixed(1)} MB`}
        />
      </ListItem>
      <ListItem>
        <ListItemText primary="memory_sys" />
        <ListItemText
          sx={{ textAlign: "end", color: "text.secondary" }}
          primary={`${Number(info.memorySysMegaByte).toFixed(1)} MB`}
        />
      </ListItem>
    </List>
  );
}

function StorageInfoList({ info }: StorageInfoListProps) {
  const [accordionExpanded, setAccordionExpanded] = useState<string | false>(
    false
  );

  const handleAccordionChange =
    (panel: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
      setAccordionExpanded(isExpanded ? panel : false);
    };

  return (
    <Box sx={{ paddingTop: "1em" }}>
      <h3>Data Storage</h3>
      <Accordion
        expanded={accordionExpanded === "panel1"}
        onChange={handleAccordionChange("panel1")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="accordion-summary-server-info-total-data-size-content"
          id="accordion-summary-server-info-total-data-size-header"
        >
          <ListItemText primary="total_data_size" />
          <ListItemText
            primary={`${info.totalDataSize} B`}
            {...allyPropsInfoValue("total-data-size")}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Total amount of stored data in bytes.</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={accordionExpanded === "panel2"}
        onChange={handleAccordionChange("panel2")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="accordion-summary-server-info-total-keys-content"
          id="accordion-summary-server-info-total-keys-header"
        >
          <ListItemText primary="total_keys" />
          <ListItemText
            primary={info.totalKeys}
            {...allyPropsInfoValue("total-keys")}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Total number of keys stored on the server.</Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default function InfoPanel() {
  const serverInfo = useServerInfoStore((state) => state.serverInfo);

  return (
    <>
      <Box sx={{ p: 3, backgroundColor: "rgb(250, 250, 250)", width: "100%" }}>
        {serverInfo ? (
          <>
            <MemoryInfoList info={serverInfo.memoryInfo} />
            <StorageInfoList info={serverInfo.storageInfo} />
          </>
        ) : (
          <CircularProgress />
        )}
      </Box>
    </>
  );
}
