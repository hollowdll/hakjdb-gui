import { invoke } from "@tauri-apps/api";
import { TauriInvokeCommands } from "../types/tauri";
import { ConnectionInfo } from "../types/types";
import { ServerInfo, ServerLogs } from "../types/server";
import { DatabaseInfo, Databases } from "../types/db";
import {
  GetAllHashMapFieldsAndValuesPayload,
  GetStringPayload,
  GetTypeOfKeyPayload,
  DeleteHashMapFieldsPayload,
  GetHashMapFieldValuePayload,
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
  getKeys: "get_keys",
  getTypeOfKey: "get_type_of_key",
  deleteKey: "delete_key",
  deleteAllKeys: "delete_all_keys",
  getString: "get_string",
  setString: "set_string",
  setHashMap: "set_hashmap",
  getAllHashMapFieldsAndValues: "get_all_hashmap_fields_and_values",
  deleteHashMapFields: "delete_hashmap_fields",
  getHashMapFieldValue: "get_hashmap_field_value",
  setPassword: "set_password",
  setTLSCertPath: "set_tls_cert_path",
  openFile: "open_file",
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

export const invokeSetPassword = (
  password: string,
  disable: boolean,
): Promise<void> => {
  return invoke<void>(tauriInvokeCommands.setPassword, {
    password,
    disable,
  });
};

export const invokeSetTLSCertPath = (
  cert_path: string,
  disable: boolean,
): Promise<void> => {
  return invoke<void>(tauriInvokeCommands.setTLSCertPath, {
    cert_path,
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

export const invokeGetDatabaseInfo = (
  dbName: string,
): Promise<DatabaseInfo> => {
  return invoke<DatabaseInfo>(tauriInvokeCommands.getDatabaseInfo, {
    dbName,
  });
};

export const invokeCreateDatabase = (dbName: string): Promise<string> => {
  return invoke<string>(tauriInvokeCommands.createDatabase, {
    dbName,
  });
};

export const invokeDeleteDatabase = (dbName: string): Promise<string> => {
  return invoke<string>(tauriInvokeCommands.deleteDatabase, {
    dbName,
  });
};

export const invokeGetKeys = (dbName: string): Promise<string[]> => {
  return invoke<string[]>(tauriInvokeCommands.getKeys, {
    dbName,
  });
};

export const invokeDeleteKey = (
  dbName: string,
  keys: string[],
): Promise<number> => {
  return invoke<number>(tauriInvokeCommands.deleteKey, {
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
  value: string,
): Promise<void> => {
  return invoke<void>(tauriInvokeCommands.setString, {
    dbName,
    key,
    value,
  });
};

export const invokeGetTypeOfKey = (
  dbName: string,
  key: string,
): Promise<GetTypeOfKeyPayload> => {
  return invoke<GetTypeOfKeyPayload>(tauriInvokeCommands.getTypeOfKey, {
    dbName,
    key,
  });
};

export const invokeSetHashMap = (
  dbName: string,
  key: string,
  fieldValueMap: Record<string, string>,
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

export const invokeGetHashMapFieldValue = (
  dbName: string,
  key: string,
  fields: string[],
): Promise<GetHashMapFieldValuePayload> => {
  return invoke<GetHashMapFieldValuePayload>(
    tauriInvokeCommands.getHashMapFieldValue,
    {
      dbName,
      key,
      fields,
    },
  );
};
