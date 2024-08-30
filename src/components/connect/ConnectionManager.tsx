import { ConnectionDialog } from "./ConnectionDialog";
import { useEffect } from "react";
import { ConnectionInfo } from "../../types/types";
import { listen } from "@tauri-apps/api/event";
import { NavBar } from "../nav/NavBar";
import { useNavigate } from "react-router-dom";
import { useConnectionInfoStore } from "../../state/store";
import { useLoadingStore } from "../../state/store";
import {
  invokeConnect,
  invokeDisconnect,
  invokeAuthenticate,
  invokeUnaryEcho,
  invokeResetAuthToken,
} from "../../tauri/command";
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

  const handleConnect = async (connectionInfo: ConnectionInfo) => {
    let errMsg = "";
    setIsLoadingBackdropOpen(true);
    try {
      const connResult = await invokeConnect(connectionInfo);
      if (connectionInfo.isUsePassword) {
        await invokeAuthenticate(connectionInfo.password);
      } else {
        await invokeResetAuthToken();
      }
      await invokeUnaryEcho("");

      setIsConnected(true);
      setConnectionInfo(connectionInfo);
      navigate("/connection");
      setSelectedNavItemIndex(0);
      successAlert(connResult);
    } catch (err) {
      errMsg = `Failed to connect: ${err}`;
      errorAlert(errMsg);
    }
    setIsLoadingBackdropOpen(false);
    return errMsg;
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
  }, [navigate, setIsConnected]);

  return (
    <>
      {isConnected ? <NavBar /> : <></>}
      <ConnectionDialog handleConnect={handleConnect} />
    </>
  );
}
