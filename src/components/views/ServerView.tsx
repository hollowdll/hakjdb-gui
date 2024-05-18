import { Button } from "@mui/material";
import { ServerInfo } from "../../types/types";
import { invoke } from "@tauri-apps/api";
import toast from "react-hot-toast";

export default function ServerView() {
  const handleGetServerInfo = () => {
    const promise = invoke<ServerInfo>("get_server_info");
    toast.promise(
      promise,
      {
        loading: "Pending...",
        success: (result) => {
          console.log(result);
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
    <>
      <h1>Server</h1>
      <Button onClick={handleGetServerInfo}>Get server information</Button>
    </>
  );
}
