import {
  Box,
  CircularProgress,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import {
  ClientInfo,
  MemoryInfo,
  StorageInfo,
  GeneralInfo,
  ServerInfo,
} from "../../types/server";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState, useEffect, SyntheticEvent } from "react";
import { errorAlert } from "../../utility/alert";
import { invokeGetServerInfo } from "../../tauri/command";

type AccordionProps = {
  accordionExpanded: string | false;
  handleAccordionChange: (
    panel: string
  ) => (_event: SyntheticEvent, isExpanded: boolean) => void;
};

type MemoryInfoListProps = {
  info: MemoryInfo;
  accordion: AccordionProps;
};

type StorageInfoListProps = {
  info: StorageInfo;
  accordion: AccordionProps;
};

type ClientInfoListProps = {
  info: ClientInfo;
  accordion: AccordionProps;
};

type GeneralInfoListProps = {
  info: GeneralInfo;
  accordion: AccordionProps;
};

function allyPropsInfoField() {
  return {
    sx: {wordBreak: "break-word"},
  }
}

function allyPropsInfoValue(infoField: string) {
  return {
    id: `server-info-value-${infoField}`,
    sx: { marginLeft: "20px", marginRight: "30px", textAlign: "end", color: "text.secondary", wordBreak: "break-word" },
  };
}

function MemoryInfoList({ info, accordion }: MemoryInfoListProps) {
  const { accordionExpanded, handleAccordionChange } = accordion;

  return (
    <Box sx={{ paddingTop: "1em" }}>
      <h3>Memory</h3>
      <Accordion
        expanded={accordionExpanded === "panel1"}
        onChange={handleAccordionChange("panel1")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="memory_alloc" {...allyPropsInfoField()} />
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
          <ListItemText primary="memory_total_alloc" {...allyPropsInfoField()} />
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
          <ListItemText primary="memory_sys" {...allyPropsInfoField()} />
          <ListItemText
            primary={`${Number(info.memorySysMegaByte).toFixed(1)} MB`}
            {...allyPropsInfoValue("memory-sys")}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Total memory obtained from the OS in megabytes.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

function StorageInfoList({ info, accordion }: StorageInfoListProps) {
  const { accordionExpanded, handleAccordionChange } = accordion;

  return (
    <Box sx={{ paddingTop: "1em" }}>
      <h3>Data Storage</h3>
      <Accordion
        expanded={accordionExpanded === "panel4"}
        onChange={handleAccordionChange("panel4")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="total_data_size" {...allyPropsInfoField()} />
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
        expanded={accordionExpanded === "panel5"}
        onChange={handleAccordionChange("panel5")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="total_keys" {...allyPropsInfoField()} />
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

function ClientInfoList({ info, accordion }: ClientInfoListProps) {
  const { accordionExpanded, handleAccordionChange } = accordion;

  return (
    <Box sx={{ paddingTop: "1em" }}>
      <h3>Clients</h3>
      <Accordion
        expanded={accordionExpanded === "panel6"}
        onChange={handleAccordionChange("panel6")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="client_connections" {...allyPropsInfoField()} />
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
        expanded={accordionExpanded === "panel7"}
        onChange={handleAccordionChange("panel7")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="max_client_connections" {...allyPropsInfoField()} />
          <ListItemText
            primary={info.maxClientConnections}
            {...allyPropsInfoValue("max-client-connections")}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Maximum number of active client connections allowed.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

function GeneralInfoList({ info, accordion }: GeneralInfoListProps) {
  const { accordionExpanded, handleAccordionChange } = accordion;

  return (
    <Box>
      <h3>General</h3>
      <Accordion
        expanded={accordionExpanded === "panel8"}
        onChange={handleAccordionChange("panel8")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="kvdb_version" {...allyPropsInfoField()} />
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
        expanded={accordionExpanded === "panel9"}
        onChange={handleAccordionChange("panel9")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="go_version" {...allyPropsInfoField()} />
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
        expanded={accordionExpanded === "panel10"}
        onChange={handleAccordionChange("panel10")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="db_count" {...allyPropsInfoField()} />
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
        expanded={accordionExpanded === "panel11"}
        onChange={handleAccordionChange("panel11")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="os" {...allyPropsInfoField()} />
          <ListItemText primary={info.os} {...allyPropsInfoValue("os")} />
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Server operating system.</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={accordionExpanded === "panel12"}
        onChange={handleAccordionChange("panel12")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="arch" {...allyPropsInfoField()} />
          <ListItemText primary={info.arch} {...allyPropsInfoValue("arch")} />
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Server architecture.</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={accordionExpanded === "panel13"}
        onChange={handleAccordionChange("panel13")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="process_id" {...allyPropsInfoField()} />
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
        expanded={accordionExpanded === "panel14"}
        onChange={handleAccordionChange("panel14")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="uptime_seconds" {...allyPropsInfoField()} />
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
        expanded={accordionExpanded === "panel15"}
        onChange={handleAccordionChange("panel15")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="tcp_port" {...allyPropsInfoField()} />
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
        expanded={accordionExpanded === "panel16"}
        onChange={handleAccordionChange("panel16")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="default_db" {...allyPropsInfoField()} />
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
        expanded={accordionExpanded === "panel17"}
        onChange={handleAccordionChange("panel17")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="tls_enabled" {...allyPropsInfoField()} />
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
        expanded={accordionExpanded === "panel18"}
        onChange={handleAccordionChange("panel18")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="password_enabled" {...allyPropsInfoField()} />
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
        expanded={accordionExpanded === "panel19"}
        onChange={handleAccordionChange("panel19")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="logfile_enabled" {...allyPropsInfoField()} />
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
        expanded={accordionExpanded === "panel20"}
        onChange={handleAccordionChange("panel20")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <ListItemText primary="debug_enabled" {...allyPropsInfoField()} />
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
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [accordionExpanded, setAccordionExpanded] = useState<string | false>(
    false
  );

  const handleAccordionChange =
    (panel: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
      setAccordionExpanded(isExpanded ? panel : false);
    };

  const handleGetServerInfo = () => {
    invokeGetServerInfo()
      .then((result) => {
        setServerInfo(result);
      })
      .catch((err) => {
        setErrorMsg(`Failed to show server info: ${err}`);
        setServerInfo(null);
        errorAlert(err);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    handleGetServerInfo();
  }, [])

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: "rgb(250, 250, 250)",
        width: "100%",
        maxWidth: "720px",
      }}
    >
      {isLoading ? (
        <CircularProgress />
      ) : serverInfo ? (
        <>
          <GeneralInfoList
            info={serverInfo.generalInfo}
            accordion={{ accordionExpanded, handleAccordionChange }}
          />
          <StorageInfoList
            info={serverInfo.storageInfo}
            accordion={{ accordionExpanded, handleAccordionChange }}
          />
          <ClientInfoList
            info={serverInfo.clientInfo}
            accordion={{ accordionExpanded, handleAccordionChange }}
          />
          <MemoryInfoList
            info={serverInfo.memoryInfo}
            accordion={{ accordionExpanded, handleAccordionChange }}
          />
        </>
      ) : errorMsg !== "" ? (
        <Typography>{errorMsg}</Typography>
      ) : (
        <></>
      )}
    </Box>
  );
}
