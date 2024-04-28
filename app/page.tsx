'use client'

import { ConnectionDialog } from "../components/connect/ConnectionDialog";
import { useState } from "react";
import { Box, CircularProgress } from "@mui/material";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    setIsConnected(true);
  }

  const handleDisconnect = () => {
    setIsConnected(false);
  }

  return (
    <main>
      {!isConnected ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "absolute", top: "50%", bottom: "50%" }}>
            <h1>Not connected to a kvdb server.</h1>
            <h1>Test</h1>
            <h1>Test 2</h1>
            <h1>Test 3</h1>
            <CircularProgress />
          </Box>
        </Box>
      ) : (
        <h1>Connected</h1>
      )}
      <ConnectionDialog handleConnect={handleConnect} />
    </main>
  );
}
