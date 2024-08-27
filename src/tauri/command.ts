import { invoke } from "@tauri-apps/api";
import { TauriInvokeCommands } from "../types/tauri";
import { ConnectionInfo } from "../types/types";
import { ServerInfo, ServerLogs } from "../types/server";
import { Database, Databases } from "../types/db";
import {
  GetAllHashMapFieldsAndValuesPayload,
  GetStringPayload,
  GetKeyTypePayload,
  DeleteHashMapFieldsPayload,
  GetHashMapFieldValuesPayload,
} from "../types/storage";

const tauriInvokeCommands: TauriInvokeCommands = {
  connect: "connect",
  disconnect: "disconnect",
  getServerInfo: "get_server_info",
  getServerLogs: "get_server_logs",
  getAllDatabases: "get_all_databases",
  getDatabaseInfo: "get_database_info",
  createDatabase: "create_database",
  deleteDatabase: "delete_database",
  changeDatabase: "change_database",
  getAllKeys: "get_all_keys",
  getKeyType: "get_key_type",
  deleteKeys: "delete_keys",
  deleteAllKeys: "delete_all_keys",
  getString: "get_string",
  setString: "set_string",
  setHashMap: "set_hashmap",
  getAllHashMapFieldsAndValues: "get_all_hashmap_fields_and_values",
  deleteHashMapFields: "delete_hashmap_fields",
  getHashMapFieldValues: "get_hashmap_field_values",
  resetAuthToken: "reset_auth_token",
  setTLSCertPath: "set_tls_cert_path",
  openFile: "open_file",
  authenticate: "authenticate",
  unaryEcho: "unary_echo",
};

export const invokeOpenFile = (): Promise<string | null> => {
  return invoke<string | null>(tauriInvokeCommands.openFile);
};

export const invokeConnect = (
  connectionInfo: ConnectionInfo,
): Promise<string> => {
  return invoke<string>(tauriInvokeCommands.connect, {
    host: connectionInfo.host,
    port: connectionInfo.port,
  });
};

export const invokeDisconnect = (): Promise<void> => {
  return invoke<void>(tauriInvokeCommands.disconnect);
};

export const invokeResetAuthToken = (): Promise<void> => {
  return invoke<void>(tauriInvokeCommands.resetAuthToken);
};

export const invokeSetTLSCertPath = (
  certPath: string,
  disable: boolean,
): Promise<void> => {
  return invoke<void>(tauriInvokeCommands.setTLSCertPath, {
    certPath,
    disable,
  });
};

export const invokeGetServerInfo = (): Promise<ServerInfo> => {
  return invoke<ServerInfo>(tauriInvokeCommands.getServerInfo);
};

export const invokeGetServerLogs = (): Promise<ServerLogs> => {
  return invoke<ServerLogs>(tauriInvokeCommands.getServerLogs);
};

export const invokeGetAllDatabases = (): Promise<Databases> => {
  return invoke<Databases>(tauriInvokeCommands.getAllDatabases);
};

export const invokeGetDatabaseInfo = (dbName: string): Promise<Database> => {
  return invoke<Database>(tauriInvokeCommands.getDatabaseInfo, {
    dbName,
  });
};

export const invokeCreateDatabase = (
  dbName: string,
  description: string,
): Promise<string> => {
  return invoke<string>(tauriInvokeCommands.createDatabase, {
    dbName,
    description,
  });
};

export const invokeDeleteDatabase = (dbName: string): Promise<string> => {
  return invoke<string>(tauriInvokeCommands.deleteDatabase, {
    dbName,
  });
};

export const invokeChangeDatabase = (
  dbName: string,
  newName: string,
  changeName: boolean,
  newDescription: string,
  changeDescription: boolean,
): Promise<string> => {
  return invoke<string>(tauriInvokeCommands.changeDatabase, {
    dbName,
    newName,
    changeName,
    newDescription,
    changeDescription,
  });
};

export const invokeGetAllKeys = (dbName: string): Promise<string[]> => {
  return invoke<string[]>(tauriInvokeCommands.getAllKeys, {
    dbName,
  });
};

export const invokeGetKeyType = (
  dbName: string,
  key: string,
): Promise<GetKeyTypePayload> => {
  return invoke<GetKeyTypePayload>(tauriInvokeCommands.getKeyType, {
    dbName,
    key,
  });
};

export const invokeDeleteKeys = (
  dbName: string,
  keys: string[],
): Promise<number> => {
  return invoke<number>(tauriInvokeCommands.deleteKeys, {
    dbName,
    keys,
  });
};

export const invokeDeleteAllKeys = (dbName: string): Promise<void> => {
  return invoke<void>(tauriInvokeCommands.deleteAllKeys, {
    dbName,
  });
};

export const invokeGetString = (
  dbName: string,
  key: string,
): Promise<GetStringPayload> => {
  return invoke<GetStringPayload>(tauriInvokeCommands.getString, {
    dbName,
    key,
  });
};

export const invokeSetString = (
  dbName: string,
  key: string,
  value: Uint8Array,
): Promise<void> => {
  return invoke<void>(tauriInvokeCommands.setString, {
    dbName,
    key,
    value,
  });
};

export const invokeSetHashMap = (
  dbName: string,
  key: string,
  fieldValueMap: Record<string, Uint8Array>,
): Promise<number> => {
  return invoke<number>(tauriInvokeCommands.setHashMap, {
    dbName,
    key,
    fieldValueMap,
  });
};

export const invokeGetAllHashMapFieldsAndValues = (
  dbName: string,
  key: string,
): Promise<GetAllHashMapFieldsAndValuesPayload> => {
  return invoke<GetAllHashMapFieldsAndValuesPayload>(
    tauriInvokeCommands.getAllHashMapFieldsAndValues,
    {
      dbName,
      key,
    },
  );
};

export const invokeDeleteHashMapFields = (
  dbName: string,
  key: string,
  fields: string[],
): Promise<DeleteHashMapFieldsPayload> => {
  return invoke<DeleteHashMapFieldsPayload>(
    tauriInvokeCommands.deleteHashMapFields,
    {
      dbName,
      key,
      fields,
    },
  );
};

export const invokeGetHashMapFieldValues = (
  dbName: string,
  key: string,
  fields: string[],
): Promise<GetHashMapFieldValuesPayload> => {
  return invoke<GetHashMapFieldValuesPayload>(
    tauriInvokeCommands.getHashMapFieldValues,
    {
      dbName,
      key,
      fields,
    },
  );
};

export const invokeAuthenticate = (password: string): Promise<void> => {
  return invoke<void>(tauriInvokeCommands.authenticate, { password });
};

export const invokeUnaryEcho = (msg: string): Promise<string> => {
  return invoke<string>(tauriInvokeCommands.unaryEcho, { msg });
};
