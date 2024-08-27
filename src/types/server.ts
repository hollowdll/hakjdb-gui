export interface ServerInfo {
  generalInfo: GeneralInfo;
  memoryInfo: MemoryInfo;
  storageInfo: StorageInfo;
  clientInfo: ClientInfo;
  dbInfo: DatabaseInfo;
}

export interface DatabaseInfo {
  dbCount: string;
  defaultDb: string;
}

export interface MemoryInfo {
  memoryAllocMegaByte: string;
  memoryTotalAllocMegaByte: string;
  memorySysMegaByte: string;
}

export interface StorageInfo {
  totalDataSize: string;
  totalKeys: string;
}

export interface ClientInfo {
  clientConnections: string;
  maxClientConnections: string;
}

export interface GeneralInfo {
  ServerVersion: string;
  goVersion: string;
  apiVersion: string;
  os: string;
  arch: string;
  processId: string;
  uptimeSeconds: string;
  tcpPort: string;
  tlsEnabled: boolean;
  authEnabled: boolean;
  logfileEnabled: boolean;
  debugEnabled: boolean;
}

export interface ServerLogs {
  logs: string[];
}

export type LogFilterType = "head" | "tail";
