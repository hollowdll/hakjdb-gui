import { ConnectionDialog } from "./ConnectionDialog";
import { useEffect } from "react";
import { ConnectionInfo } from "../../types/types";
import { listen } from "@tauri-apps/api/event";
import { NavBar } from "../nav/NavBar";
import { useNavigate } from "react-router-dom";
import { useConnectionInfoStore } from "../../state/store";
import { useLoadingStore } from "../../state/store";
import { invokeConnect, invokeDisconnect } from "../../tauri/command";
import { tauriListenEvents } from "../../tauri/event";
import { useNavigationStore } from "../../state/store";
import { successAlert, errorAlert } from "../../utility/alert";

export default function ConnectionManager() {
  const navigate = useNavigate();
  const isConnected = useConnectionInfoStore((state) => state.isConnected);
  const setIsConnected = useConnectionInfoStore(
    (state) => state.setIsConnected,
  );
  const setConnectionInfo = useConnectionInfoStore(
    (state) => state.setConnectionInfo,
  );
  const setSelectedNavItemIndex = useNavigationStore(
    (state) => state.setSelectedNavItemIndex,
  );
  const setIsLoadingBackdropOpen = useLoadingStore(
    (state) => state.setIsLoadingBackdropOpen,
  );

  const handleConnect = (connectionInfo: ConnectionInfo) => {
    setIsLoadingBackdropOpen(true);
    invokeConnect(connectionInfo)
      .then((result) => {
        setIsConnected(true);
        setConnectionInfo(connectionInfo);
        navigate("/connection");
        setSelectedNavItemIndex(0);
        successAlert(result);
      })
      .catch((err) => {
        const errMsg = `Failed to connect: ${err}`;
        console.error(errMsg);
        errorAlert(errMsg);
      })
      .finally(() => {
        setIsLoadingBackdropOpen(false);
      });
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
