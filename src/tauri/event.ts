import { TauriListenEvent } from "../types/tauri";

export const tauriListenEvent: TauriListenEvent = {
  newConnection: "new-connection",
  disconnect: "disconnect",
}