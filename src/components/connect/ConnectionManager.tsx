import { ConnectionDialog } from "./ConnectionDialog";
import { useState, useEffect } from "react";
import { ConnectionInfo } from "../../types/types";
import { listen } from "@tauri-apps/api/event";
import toast from "react-hot-toast";
import { NavBar } from "../nav/NavBar";
import { useNavigate } from "react-router-dom";
import { useConnectionInfoStore } from "../../state/store";
import { invokeConnect, invokeDisconnect } from "../../tauri/command";
import { tauriListenEvents } from "../../tauri/event";
import { useNavigationStore } from "../../state/store";

export default function ConnectionManager() {
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const setConnectionInfo = useConnectionInfoStore((state) => state.setConnectionInfo);
  const setSelectedNavItemIndex = useNavigationStore((state) => state.setSelectedNavItemIndex);

  const handleConnect = (connectionInfo: ConnectionInfo) => {
    const promise = invokeConnect(connectionInfo);
    toast.promise(
      promise,
      {
        loading: "Connecting...",
        success: (result) => {
          setIsConnected(true);
          setConnectionInfo(connectionInfo);
          navigate("/connection");
          setSelectedNavItemIndex(0);
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
    const disconnect = listen(tauriListenEvents.disconnect, (event) => {
      console.log("event ->", event.event);
      invokeDisconnect()
        .then(() => {
          setIsConnected(false);
          navigate("/");
        })
        .catch(console.error);
    });

    return () => {
      disconnect.then((resolve) => resolve());
    };
  }, [navigate]);

  return (
    <>
      {isConnected ? <NavBar /> : <></>}
      <ConnectionDialog handleConnect={handleConnect} />
    </>
  );
}
