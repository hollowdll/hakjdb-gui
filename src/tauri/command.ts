import { invoke } from "@tauri-apps/api";
import { TauriInvokeCommand } from "../types/tauri"
import { ConnectionInfo } from "../types/types";
import { ServerInfo, ServerLogs } from "../types/server";

const tauriInvokeCommand: TauriInvokeCommand = {
  connect: "connect",
  disconnect: "disconnect",
  getServerInfo: "get_server_info",
  getServerLogs: "get_server_logs",
}

export const invokeConnect = (connectionInfo: ConnectionInfo): Promise<string> => {
  return invoke<string>(tauriInvokeCommand.connect, {
    host: connectionInfo.host,
    port: connectionInfo.port,
  });
}

export const invokeDisconnect = (): Promise<void> => {
  return invoke<void>(tauriInvokeCommand.disconnect);
}

export const invokeGetServerInfo = (): Promise<ServerInfo> => {
  return invoke<ServerInfo>(tauriInvokeCommand.getServerInfo);
}

export const invokeGetServerLogs = (): Promise<ServerLogs> => {
  return invoke<ServerLogs>(tauriInvokeCommand.getServerLogs);
}
