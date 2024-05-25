import { useState, useEffect, SyntheticEvent } from "react";
import { invokeGetAllDatabases } from "../../tauri/command";
import { errorAlert } from "../../utility/alert";
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography, CircularProgress } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function DatabaseList() {
  const [databases, setDatabases] = useState<string[] | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [accordionExpanded, setAccordionExpanded] = useState<string | false>(
    false
  );

  const handleAccordionChange =
    (panel: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
      setAccordionExpanded(isExpanded ? panel : false);
    };

  const handleGetAllDatabases = () => {
    invokeGetAllDatabases()
      .then((result) => {
        setDatabases(result);
      })
      .catch((err) => {
        setErrorMsg(`Failed to show databases: ${err}`);
        setDatabases(null);
        errorAlert(err);
      })
      .finally(() => setIsLoading(false));
  };

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
                  onChange={handleAccordionChange(`panel${index+1}`)}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{}}>{dbName}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <h3>Database Information</h3>
                    <CircularProgress />
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