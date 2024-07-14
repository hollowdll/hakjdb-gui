import { useState, useEffect, SyntheticEvent } from "react";
import {
  invokeGetAllDatabases,
  invokeGetDatabaseInfo,
} from "../../tauri/command";
import { errorAlert } from "../../utility/alert";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  CircularProgress,
  Stack,
  ListItemText,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DatabaseInfo } from "../../types/db";
import { useDatabaseStore } from "../../state/store";
import { useConnectionInfoStore } from "../../state/store";
import DeleteDatabaseDialog from "./DeleteDatabaseDialog";
import { allyPropsAccordionSummary } from "../../utility/props";

export default function DatabaseList() {
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDbInfoLoading, setIsDbInfoLoading] = useState(true);
  const [dbInfo, setDbInfo] = useState<DatabaseInfo | null>(null);
  const [accordionExpanded, setAccordionExpanded] = useState<string | false>(
    false,
  );
  const databases = useDatabaseStore((state) => state.databases);
  const setDatabases = useDatabaseStore((state) => state.setDatabases);
  const setDefaultDb = useConnectionInfoStore((state) => state.setDefaultDb);
  const connectionInfo = useConnectionInfoStore(
    (state) => state.connectionInfo,
  );

  const closeAccordion = () => {
    setAccordionExpanded(false);
  };

  const handleAccordionChange =
    (panel: string, dbName: string) =>
    (_event: SyntheticEvent, isExpanded: boolean) => {
      if (isExpanded) {
        setAccordionExpanded(panel);
        handleGetDatabaseInfo(dbName);
      } else {
        setAccordionExpanded(false);
      }
    };

  const handleSetDefaultDb = (name: string) => {
    setDefaultDb(name);
  };

  const isDbSetAsDefault = (name: string): boolean => {
    return name === connectionInfo.defaultDb;
  };

  const handleGetDatabaseInfo = (dbName: string) => {
    console.log("getting db info");
    setIsDbInfoLoading(true);
    invokeGetDatabaseInfo(dbName)
      .then((result) => {
        setDbInfo(result);
      })
      .catch((err) => {
        setErrorMsg(`Failed to show database information: ${err}`);
        setDbInfo(null);
      })
      .finally(() => setIsDbInfoLoading(false));
  };

  function allyPropsInfoField() {
    return {
      sx: { marginRight: "80px" },
    };
  }

  function allyPropsInfoValue(infoField: string) {
    return {
      id: `db-info-value-${infoField}`,
      sx: {
        marginRight: "50px",
        textAlign: "end",
        color: "text.secondary",
        wordBreak: "break-word",
      },
    };
  }

  useEffect(() => {
    const handleGetAllDatabases = () => {
      invokeGetAllDatabases()
        .then((result) => {
          setDatabases(result.dbNames);
        })
        .catch((err) => {
          setDatabases(null);
          const newErrorMsg = `Failed to show databases: ${err}`;
          setErrorMsg(newErrorMsg);
          errorAlert(newErrorMsg);
        })
        .finally(() => setIsLoading(false));
    };
    handleGetAllDatabases();
  }, [setDatabases]);

  return (
    <>
      <Box sx={{ paddingTop: "1em", width: "100%" }}>
        {isLoading ? (
          <CircularProgress />
        ) : databases ? (
          <>
            {databases.map((dbName, index) => (
              <Accordion
                expanded={accordionExpanded === `panel${index + 1}`}
                onChange={handleAccordionChange(`panel${index + 1}`, dbName)}
                key={index + 1}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  {...allyPropsAccordionSummary()}
                >
                  <Typography sx={{ wordBreak: "break-word" }}>
                    {dbName}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {isDbSetAsDefault(dbName) ? (
                    <Typography sx={{ marginBottom: "15px" }}>
                      This database is set as the default database for the
                      connection.
                    </Typography>
                  ) : (
                    <></>
                  )}
                  <Stack spacing={2} direction="row">
                    <Button
                      variant="contained"
                      onClick={() => handleSetDefaultDb(dbName)}
                    >
                      Set as default
                    </Button>
                    <DeleteDatabaseDialog
                      dbName={dbName}
                      closeDbListAccordion={closeAccordion}
                    />
                  </Stack>
                  <h3>Database Information</h3>
                  {isDbInfoLoading ? (
                    <CircularProgress />
                  ) : dbInfo ? (
                    <>
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          {...allyPropsAccordionSummary()}
                        >
                          <ListItemText
                            primary="Name"
                            {...allyPropsInfoField()}
                          />
                          <ListItemText
                            primary={dbInfo.name}
                            {...allyPropsInfoValue("name")}
                          />
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>Name of the database.</Typography>
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          {...allyPropsAccordionSummary()}
                        >
                          <ListItemText
                            primary="Created At"
                            {...allyPropsInfoField()}
                          />
                          <ListItemText
                            primary={dbInfo.createdAt}
                            {...allyPropsInfoValue("created-at")}
                          />
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            UTC timestamp when the database was created.
                          </Typography>
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          {...allyPropsAccordionSummary()}
                        >
                          <ListItemText
                            primary="Updated At"
                            {...allyPropsInfoField()}
                          />
                          <ListItemText
                            primary={dbInfo.updatedAt}
                            {...allyPropsInfoValue("updated-at")}
                          />
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            UTC timestamp when the database was last updated.
                          </Typography>
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          {...allyPropsAccordionSummary()}
                        >
                          <ListItemText
                            primary="Keys"
                            {...allyPropsInfoField()}
                          />
                          <ListItemText
                            primary={dbInfo.keyCount}
                            {...allyPropsInfoValue("keys")}
                          />
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            Number of keys stored in the database.
                          </Typography>
                        </AccordionDetails>
                      </Accordion>

                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          {...allyPropsAccordionSummary()}
                        >
                          <ListItemText
                            primary="Data Size"
                            {...allyPropsInfoField()}
                          />
                          <ListItemText
                            primary={`${dbInfo.dataSize} B`}
                            {...allyPropsInfoValue("data-size")}
                          />
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            Size of the stored data in bytes.
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    </>
                  ) : errorMsg !== "" ? (
                    <Typography>{errorMsg}</Typography>
                  ) : (
                    <></>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </>
        ) : errorMsg !== "" ? (
          <Typography>{errorMsg}</Typography>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}
