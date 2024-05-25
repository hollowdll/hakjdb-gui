import { invoke } from "@tauri-apps/api";
import { TauriInvokeCommands } from "../types/tauri"
import { ConnectionInfo } from "../types/types";
import { ServerInfo, ServerLogs } from "../types/server";

const tauriInvokeCommands: TauriInvokeCommands = {
  connect: "connect",
  disconnect: "disconnect",
  getServerInfo: "get_server_info",
  getServerLogs: "get_server_logs",
}

export const invokeConnect = (connectionInfo: ConnectionInfo): Promise<string> => {
  return invoke<string>(tauriInvokeCommands.connect, {
    host: connectionInfo.host,
    port: connectionInfo.port,
  });
}

export const invokeDisconnect = (): Promise<void> => {
  return invoke<void>(tauriInvokeCommands.disconnect);
}

export const invokeGetServerInfo = (): Promise<ServerInfo> => {
  return invoke<ServerInfo>(tauriInvokeCommands.getServerInfo);
}

export const invokeGetServerLogs = (): Promise<ServerLogs> => {
  return invoke<ServerLogs>(tauriInvokeCommands.getServerLogs);
}
