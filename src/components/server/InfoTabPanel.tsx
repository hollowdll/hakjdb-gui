import {
  Box,
  CircularProgress,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { useServerInfoStore } from "../../state/store";
import { ClientInfo, MemoryInfo, StorageInfo, GeneralInfo } from "../../types/server";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState, SyntheticEvent } from "react";

type MemoryInfoListProps = {
  info: MemoryInfo,
};

type StorageInfoListProps = {
  info: StorageInfo,
};

type ClientInfoListProps = {
  info: ClientInfo,
}

type GeneralInfoListProps = {
  info: GeneralInfo,
}

function allyPropsInfoValue(infoField: string) {
  return {
    id: `server-info-value-${infoField}`,
    sx: { 'marginRight': '30px', textAlign: "end", color: "text.secondary" },
  };
}

function MemoryInfoList({ info }: MemoryInfoListProps) {
  const [accordionExpanded, setAccordionExpanded] = useState<string | false>(
    false
  );

  const handleAccordionChange =
    (panel: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
      setAccordionExpanded(isExpanded ? panel : false);
    };

  return (
    <Box sx={{ paddingTop: "1em" }}>
    <h3>Memory</h3>
    <Accordion
      expanded={accordionExpanded === "panel1"}
      onChange={handleAccordionChange("panel1")}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <ListItemText primary="memory_alloc" />
        <ListItemText
          primary={`${Number(info.memoryAllocMegaByte).toFixed(1)} MB`}
          {...allyPropsInfoValue("memory-alloc")}
        />
      </AccordionSummary>
      <AccordionDetails>
        <Typography>Allocated memory in megabytes.</Typography>
      </AccordionDetails>
    </Accordion>

    <Accordion
      expanded={accordionExpanded === "panel2"}
      onChange={handleAccordionChange("panel2")}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <ListItemText primary="memory_total_alloc" />
        <ListItemText
          primary={`${Number(info.memoryTotalAllocMegaByte).toFixed(1)} MB`}
          {...allyPropsInfoValue("memory-total-alloc")}
        />
      </AccordionSummary>
      <AccordionDetails>
        <Typography>Total allocated memory in megabytes.</Typography>
      </AccordionDetails>
    </Accordion>

    <Accordion
      expanded={accordionExpanded === "panel3"}
      onChange={handleAccordionChange("panel3")}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <ListItemText primary="memory_sys" />
        <ListItemText
          primary={`${Number(info.memorySysMegaByte).toFixed(1)} MB`}
          {...allyPropsInfoValue("memory-sys")}
        />
      </AccordionSummary>
      <AccordionDetails>
        <Typography>Total memory obtained from the OS in megabytes.</Typography>
      </AccordionDetails>
    </Accordion>
  </Box>
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
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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

function ClientInfoList({ info }: ClientInfoListProps) {
  const [accordionExpanded, setAccordionExpanded] = useState<string | false>(
    false
  );

  const handleAccordionChange =
    (panel: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
      setAccordionExpanded(isExpanded ? panel : false);
    };

  return (
    <Box sx={{ paddingTop: "1em" }}>
      <h3>Clients</h3>
      <Accordion
        expanded={accordionExpanded === "panel1"}
        onChange={handleAccordionChange("panel1")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="client_connections" />
          <ListItemText
            primary={info.clientConnections}
            {...allyPropsInfoValue("client-connections")}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Number of active client connections.</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={accordionExpanded === "panel2"}
        onChange={handleAccordionChange("panel2")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="max_client_connections" />
          <ListItemText
            primary={info.maxClientConnections}
            {...allyPropsInfoValue("max-client-connections")}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Maximum number of active client connections allowed.</Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

function GeneralInfoList({ info }: GeneralInfoListProps) {
  const [accordionExpanded, setAccordionExpanded] = useState<string | false>(
    false
  );

  const handleAccordionChange =
    (panel: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
      setAccordionExpanded(isExpanded ? panel : false);
    };

  return (
    <Box>
      <h3>General</h3>
      <Accordion
        expanded={accordionExpanded === "panel1"}
        onChange={handleAccordionChange("panel1")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="kvdb_version" />
          <ListItemText
            primary={info.kvdbVersion}
            {...allyPropsInfoValue("kvdb-version")}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Version of kvdb.</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={accordionExpanded === "panel2"}
        onChange={handleAccordionChange("panel2")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="go_version" />
          <ListItemText
            primary={info.goVersion}
            {...allyPropsInfoValue("go-version")}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Version of go used to compile the server.</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={accordionExpanded === "panel3"}
        onChange={handleAccordionChange("panel3")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="db_count" />
          <ListItemText
            primary={info.dbCount}
            {...allyPropsInfoValue("db-count")}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Number of databases.</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={accordionExpanded === "panel4"}
        onChange={handleAccordionChange("panel4")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="os" />
          <ListItemText
            primary={info.os}
            {...allyPropsInfoValue("os")}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Server operating system.</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={accordionExpanded === "panel5"}
        onChange={handleAccordionChange("panel5")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="arch" />
          <ListItemText
            primary={info.arch}
            {...allyPropsInfoValue("arch")}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Server architecture.</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={accordionExpanded === "panel6"}
        onChange={handleAccordionChange("panel6")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="process_id" />
          <ListItemText
            primary={info.processId}
            {...allyPropsInfoValue("process-id")}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typography>PID of the server process.</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={accordionExpanded === "panel7"}
        onChange={handleAccordionChange("panel7")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="uptime_seconds" />
          <ListItemText
            primary={info.uptimeSeconds}
            {...allyPropsInfoValue("uptime-seconds")}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Server process uptime in seconds.</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={accordionExpanded === "panel8"}
        onChange={handleAccordionChange("panel8")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="tcp_port" />
          <ListItemText
            primary={info.tcpPort}
            {...allyPropsInfoValue("tcp-port")}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Server TCP/IP port.</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={accordionExpanded === "panel9"}
        onChange={handleAccordionChange("panel9")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="default_db" />
          <ListItemText
            primary={info.defaultDb}
            {...allyPropsInfoValue("default-db")}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typography>The default database that the server uses.</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={accordionExpanded === "panel10"}
        onChange={handleAccordionChange("panel10")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="tls_enabled" />
          <ListItemText
            primary={info.tlsEnabled ? "Yes" : "No"}
            {...allyPropsInfoValue("tls-enabled")}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typography>If TLS is enabled. Yes or no.</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={accordionExpanded === "panel11"}
        onChange={handleAccordionChange("panel11")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="password_enabled" />
          <ListItemText
            primary={info.passwordEnabled ? "Yes" : "No"}
            {...allyPropsInfoValue("password-enabled")}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typography>If password protection is enabled. Yes or no.</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={accordionExpanded === "panel12"}
        onChange={handleAccordionChange("panel12")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="logfile_enabled" />
          <ListItemText
            primary={info.logfileEnabled ? "Yes" : "No"}
            {...allyPropsInfoValue("logfile-enabled")}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typography>If the log file is enabled. Yes or no.</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={accordionExpanded === "panel13"}
        onChange={handleAccordionChange("panel13")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="debug_enabled" />
          <ListItemText
            primary={info.debugEnabled ? "Yes" : "No"}
            {...allyPropsInfoValue("debug-enabled")}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typography>If debug mode is enabled. Yes or no.</Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default function InfoTabPanel() {
  const serverInfo = useServerInfoStore((state) => state.serverInfo);

  return (
    <Box sx={{ p: 3, backgroundColor: "rgb(250, 250, 250)", width: "100%", maxWidth: "720px" }}>
      {serverInfo ? (
        <>
          <GeneralInfoList info={serverInfo.generalInfo} />
          <StorageInfoList info={serverInfo.storageInfo} />
          <ClientInfoList info={serverInfo.clientInfo} />
          <MemoryInfoList info={serverInfo.memoryInfo} />
        </>
      ) : (
        <CircularProgress />
      )}
    </Box>
  );
}
