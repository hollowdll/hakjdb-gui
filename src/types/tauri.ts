export type TauriInvokeCommand = {
  connect: string,
  disconnect: string,
  getServerInfo: string,
  getServerLogs: string,
}

export type TauriListenEvent = {
  newConnection: string,
  disconnect: string,
}