import { TauriListenEvents } from "../types/tauri";

export const tauriListenEvents: TauriListenEvents = {
  newConnection: "new-connection",
  disconnect: "disconnect",
};
