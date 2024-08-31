import { TauriListenEvents } from "../types/tauri";

export type EventPayloadSetDarkMode = {
  darkMode: boolean;
  save: boolean;
}

export const tauriListenEvents: TauriListenEvents = {
  newConnection: "new-connection",
  disconnect: "disconnect",
  setDarkMode: "set-dark-mode",
};
