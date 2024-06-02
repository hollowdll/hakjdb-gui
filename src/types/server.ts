export interface ServerInfo {
  generalInfo: GeneralInfo,
  memoryInfo: MemoryInfo,
  storageInfo: StorageInfo,
  clientInfo: ClientInfo,
}

export interface MemoryInfo {
  memoryAllocMegaByte: string,
  memoryTotalAllocMegaByte: string,
  memorySysMegaByte: string,
}

export interface StorageInfo {
  totalDataSize: string,
  totalKeys: string,
}

export interface ClientInfo {
  clientConnections: string,
  maxClientConnections: string,
}

export interface GeneralInfo {
  kvdbVersion: string,
  goVersion: string,
  dbCount: string,
  os: string,
  arch: string,
  processId: string,
  uptimeSeconds: string,
  tcpPort: string,
  tlsEnabled: boolean,
  passwordEnabled: boolean,
  logfileEnabled: boolean,
  debugEnabled: boolean,
  defaultDb: string,
}

export interface ServerLogs {
  logs: string[],
}

export type LogFilterType = "head" | "tail"