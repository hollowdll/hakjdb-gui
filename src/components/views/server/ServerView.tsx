import { Box, Button } from "@mui/material";
import { ServerInfo } from "../../../types/server";
import { invoke } from "@tauri-apps/api";
import toast from "react-hot-toast";
import TabMenu from "../../server/TabMenu";
import { useServerInfoStore } from "../../../state/store";

export default function ServerView() {
  const setServerInfo = useServerInfoStore((state) => state.setServerInfo);

  const handleGetServerInfo = () => {
    const promise = invoke<ServerInfo>("get_server_info");
    toast.promise(
      promise,
      {
        loading: "Pending...",
        success: (result) => {
          console.log(result);
          setServerInfo(result);
          return "Got server information";
        },
        error: (error) => {
          const errorMsg = `Failed to get server information: ${error}`;
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

  return (
    <Box sx={{width: "100%"}}>
      <h1>Server</h1>
      <Button onClick={handleGetServerInfo}>Get server information</Button>
      <TabMenu />
    </Box>
  );
}
