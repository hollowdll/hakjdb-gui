export type TauriInvokeCommands = {
  connect: string,
  disconnect: string,
  getServerInfo: string,
  getServerLogs: string,
  getAllDatabases: string,
  getDatabaseInfo: string,
  createDatabase: string,
  deleteDatabase: string,
}

export type TauriListenEvents = {
  newConnection: string,
  disconnect: string,
}