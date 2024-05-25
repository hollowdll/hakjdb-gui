import { Box, Stack, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DatabaseList from "../database/DatabaseList";
import CreateDatabaseDialog from "../database/CreateDatabaseDialog";

export default function DatabasesView() {
  return (
    <Box>
      <h1>Databases</h1>
      <Stack spacing={2} direction="row">
        <Button variant="contained" startIcon={<AddIcon />}>New</Button>
      </Stack>
      <DatabaseList />
      <CreateDatabaseDialog />
    </Box>
  );
}
