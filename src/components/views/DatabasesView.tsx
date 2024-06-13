import { Box, Stack } from "@mui/material";
import DatabaseList from "../database/DatabaseList";
import CreateDatabaseDialog from "../database/CreateDatabaseDialog";

export default function DatabasesView() {
  return (
    <Box sx={{ width: "100%" }}>
      <h1>Databases</h1>
      <Stack spacing={2} direction="row">
        <CreateDatabaseDialog />
      </Stack>
      <DatabaseList />
    </Box>
  );
}
