'use client'

import { ConnectionDialog } from "@/components/connect/ConnectionDialog";
import { useState, useEffect } from "react";
import { Box, Button, CircularProgress, CssBaseline } from "@mui/material";
import { ConnectionInfo, ServerInfo } from "@/types/types";
import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import toast, { Toaster } from 'react-hot-toast';
import { NavBar } from "@/components/nav/NavBar";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = (connectionInfo: ConnectionInfo) => {
    const promise = invoke<string>('connect', { host: connectionInfo.host, port: connectionInfo.port })
    toast.promise(
      promise,
      {
        loading: "Connecting...",
        success: (result) => {
          setIsConnected(true);
          return result;
        },
        error: (error) => {
          const errorMsg = `Failed to connect: ${error}`;
          console.error(errorMsg);
          return errorMsg
        }
      },
      {
        style: {
          minWidth: "250px",
        },
        success: {
          duration: 4000,
        },
        error: {
          duration: 4000,
        }
      }
    )
  }

  const handleDisconnect = () => {
    setIsConnected(false);
  }

  const handleGetServerInfo = () => {
    const promise = invoke<ServerInfo>('get_server_info')
    toast.promise(
      promise,
      {
        loading: "Pending...",
        success: (result) => {
          console.log(result);
          return "Got server information"
        },
        error: (error) => {
          const errorMsg = `Failed to get server information: ${error}`;
          console.error(errorMsg);
          return errorMsg
        }
      },
      {
        style: {
          minWidth: "250px",
        },
        success: {
          duration: 4000,
        },
        error: {
          duration: 4000,
        }
      }
    )
  }

  useEffect(() => {
    const disconnect = listen("disconnect", (event) => {
      console.log("event ->", event.event);
      invoke('disconnect')
        .then(_ => setIsConnected(false))
        .catch(console.error)
    });

    return () => {
      disconnect.then((resolve) => resolve());
    };
  }, []);

  return (
    <main>
      {!isConnected ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "absolute", top: "50%", bottom: "50%" }}>
            <h1>Not connected to a kvdb server.</h1>
            <h1>Start by connecting to a kvdb server.</h1>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: "flex" }}>
          <NavBar />
          <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
            <h1>Connected</h1>
            <Button onClick={handleGetServerInfo}>
              Get server information
            </Button>
          </Box>
        </Box>
      )}
      <ConnectionDialog handleConnect={handleConnect} />
      <Toaster />
    </main>
  );
}
