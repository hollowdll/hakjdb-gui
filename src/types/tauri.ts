export type TauriInvokeCommands = {
  connect: string,
  disconnect: string,
  getServerInfo: string,
  getServerLogs: string,
}

export type TauriListenEvents = {
  newConnection: string,
  disconnect: string,
}