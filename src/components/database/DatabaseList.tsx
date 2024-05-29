import { useState, useEffect, SyntheticEvent } from "react";
import { invokeGetAllDatabases, invokeGetDatabaseInfo } from "../../tauri/command";
import { errorAlert } from "../../utility/alert";
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography, CircularProgress, Stack, Button, ListItemText } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatabaseInfo } from "../../types/db";
import { useDatabaseStore } from "../../state/store";

export default function DatabaseList() {
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDbInfoLoading, setIsDbInfoLoading] = useState(true);
  const [dbInfo, setDbInfo] = useState<DatabaseInfo | null>(null);
  const [accordionExpanded, setAccordionExpanded] = useState<string | false>(
    false
  );
  const databases = useDatabaseStore((state) => state.databases);
  const setDatabases = useDatabaseStore((state) => state.setDatabases);

  const handleAccordionChange =
    (panel: string, dbName: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
      if (isExpanded) {
        setAccordionExpanded(panel);
        handleGetDatabaseInfo(dbName);
      } else {
        setAccordionExpanded(false);
      }
    };

  const handleGetAllDatabases = () => {
    invokeGetAllDatabases()
      .then((result) => {
        setDatabases(result.dbNames);
      })
      .catch((err) => {
        setErrorMsg(`Failed to show databases: ${err}`);
        setDatabases(null);
        errorAlert(err);
      })
      .finally(() => setIsLoading(false));
  };

  const handleGetDatabaseInfo = (dbName: string) => {
    console.log("getting db info")
    setIsDbInfoLoading(true);
    invokeGetDatabaseInfo(dbName)
      .then((result => {
        setDbInfo(result);
      }))
      .catch((err) => {
        setErrorMsg(`Failed to show database information: ${err}`);
        setDbInfo(null);
      })
      .finally(() => setIsDbInfoLoading(false));
  }

  function allyPropsInfoField() {
    return {
      sx: { marginRight: "80px" },
    }
  }
  
  function allyPropsInfoValue(infoField: string) {
    return {
      id: `db-info-value-${infoField}`,
      sx: { marginRight: "50px", textAlign: "end", color: "text.secondary", wordBreak: "break-word" },
    };
  }

  useEffect(() => {
    handleGetAllDatabases();
  }, [])

  return (
    <>
      <Box sx={{ paddingTop: "1em", width: "100%" }}>
        {isLoading ? (
            <CircularProgress />
          ) : databases ? (
            <>
              {databases.map((dbName, index) => (
                <Accordion
                  expanded={accordionExpanded === `panel${index+1}`}
                  onChange={handleAccordionChange(`panel${index+1}`, dbName)}
                  key={index+1}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{display: "flex", alignItems: "center"}}>{dbName}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2} direction="row">
                      <Button variant="contained" endIcon={<DeleteIcon />} color="error">Delete</Button>
                    </Stack>
                    <h3>Database Information</h3>
                    {isDbInfoLoading ? (
                      <CircularProgress />
                    ) : dbInfo ? (
                      <>
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <ListItemText primary="Name" {...allyPropsInfoField()} />
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
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <ListItemText primary="Created At" {...allyPropsInfoField()} />
                            <ListItemText
                              primary={dbInfo.createdAt}
                              {...allyPropsInfoValue("created-at")}
                            />
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>UTC timestamp when the database was created.</Typography>
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <ListItemText primary="Updated At" {...allyPropsInfoField()} />
                            <ListItemText
                              primary={dbInfo.updatedAt}
                              {...allyPropsInfoValue("updated-at")}
                            />
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>UTC timestamp when the database was last updated.</Typography>
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <ListItemText primary="Keys" {...allyPropsInfoField()} />
                            <ListItemText
                              primary={dbInfo.keyCount}
                              {...allyPropsInfoValue("keys")}
                            />
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>Number of keys stored in the database.</Typography>
                          </AccordionDetails>
                        </Accordion>

                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <ListItemText primary="Data Size" {...allyPropsInfoField()} />
                            <ListItemText
                              primary={`${dbInfo.dataSize} B`}
                              {...allyPropsInfoValue("data-size")}
                            />
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>Size of the stored data in bytes.</Typography>
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