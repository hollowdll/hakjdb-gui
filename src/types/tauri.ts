export type TauriInvokeCommands = {
  connect: string,
  disconnect: string,
  getServerInfo: string,
  getServerLogs: string,
  getAllDatabases: string,
  getDatabaseInfo: string,
  createDatabase: string,
  deleteDatabase: string,
  getKeys: string,
  getString: string,
  setString: string,
}

export type TauriListenEvents = {
  newConnection: string,
  disconnect: string,
}