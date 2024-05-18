import './App.css'
import { ConnectionDialog } from "./components/connect/ConnectionDialog";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { ConnectionInfo } from './types/types';
import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import toast, { Toaster } from "react-hot-toast";
import { NavBar } from './components/nav/NavBar';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import ConnectionView from './components/views/ConnectionView';
import ServerView from './components/views/ServerView';
import DatabasesView from './components/views/DatabasesView';
import KeysView from './components/views/KeysView';

function App() {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = (connectionInfo: ConnectionInfo) => {
    const promise = invoke<string>("connect", {
      host: connectionInfo.host,
      port: connectionInfo.port,
    });
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
          return errorMsg;
        },
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
        },
      }
    );
  };

  useEffect(() => {
    const disconnect = listen("disconnect", (event) => {
      console.log("event ->", event.event);
      invoke("disconnect")
        .then(() => setIsConnected(false))
        .catch(console.error);
    });

    return () => {
      disconnect.then((resolve) => resolve());
    };
  }, []);

  return (
    <>
      {!isConnected ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "absolute", top: "50%", bottom: "50%" }}>
            <h1>Not connected to a kvdb server.</h1>
            <h1>Start by connecting to a kvdb server.</h1>
          </Box>
        </Box>
      ) : (
        <Router>
          <Box sx={{ display: "flex" }}>
            <NavBar />
            <Routes>
              <Route path="/connection" element={<ConnectionView />} />
              <Route path="/server" element={<ServerView />} />
              <Route path="/databases" element={<DatabasesView />} />
              <Route path="/keys" element={<KeysView />} />
            </Routes>
          </Box>
        </Router>
      )}
      <ConnectionDialog handleConnect={handleConnect} />
      <Toaster />
    </>
  )
}

export default App
