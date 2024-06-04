import { invoke } from "@tauri-apps/api";
import { TauriInvokeCommands } from "../types/tauri"
import { ConnectionInfo } from "../types/types";
import { ServerInfo, ServerLogs } from "../types/server";
import { DatabaseInfo, Databases } from "../types/db";
import { GetStringPayload } from "../types/storage";

const tauriInvokeCommands: TauriInvokeCommands = {
  connect: "connect",
  disconnect: "disconnect",
  getServerInfo: "get_server_info",
  getServerLogs: "get_server_logs",
  getAllDatabases: "get_all_databases",
  getDatabaseInfo: "get_database_info",
  createDatabase: "create_database",
  deleteDatabase: "delete_database",
  getKeys: "get_keys",
  getString: "get_string",
  setString: "set_string",
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

export const invokeGetAllDatabases = (): Promise<Databases> => {
  return invoke<Databases>(tauriInvokeCommands.getAllDatabases);
}

export const invokeGetDatabaseInfo = (dbName: string): Promise<DatabaseInfo> => {
  return invoke<DatabaseInfo>(tauriInvokeCommands.getDatabaseInfo, {
    dbName
  });
}

export const invokeCreateDatabase = (dbName: string): Promise<string> => {
  return invoke<string>(tauriInvokeCommands.createDatabase, {
    dbName
  });
}

export const invokeDeleteDatabase = (dbName: string): Promise<string> => {
  return invoke<string>(tauriInvokeCommands.deleteDatabase, {
    dbName
  });
}

export const invokeGetKeys = (): Promise<string[]> => {
  return invoke<string[]>(tauriInvokeCommands.getKeys);
}

export const invokeGetString = (key: string): Promise<GetStringPayload> => {
  return invoke<GetStringPayload>(tauriInvokeCommands.getString, {
    key
  });
}

export const invokeSetString = (key: string, value: string): Promise<void> => {
  return invoke<void>(tauriInvokeCommands.setString, {
    key, value
  });
}
