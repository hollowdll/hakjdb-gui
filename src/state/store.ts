import { create } from "zustand";
import { ConnectionInfo } from "../types/types";
import { ServerInfo } from "../types/server";
import { invokeGetAllDatabases } from "../tauri/command";
import { errorAlert } from "../utility/alert";
import { sortAlphabetically } from "../utility/sorting";
import { AlertSeverity } from "../components/common/AlertBox";

interface ConnectionInfoState {
  connectionInfo: ConnectionInfo;
  isConnected: boolean;
  setConnectionInfo: (newConnectionInfo: ConnectionInfo) => void;
  setDefaultDb: (name: string) => void;
  setIsConnected: (isConnected: boolean) => void;
}

interface ServerInfoState {
  serverInfo: ServerInfo | null;
  setServerInfo: (newServerInfo: ServerInfo) => void;
}

interface NavigationState {
  selectedNavItemIndex: number;
  setSelectedNavItemIndex: (newIndex: number) => void;
}

interface AlertBoxState {
  isOpen: boolean;
  message: string;
  severity: AlertSeverity;
  open: () => void;
  close: () => void;
  setContent: (message: string, severity: AlertSeverity) => void;
}

interface DatabaseState {
  databases: string[] | null;
  setDatabases: (newDatabases: string[] | null) => void;
  getAllDatabases: () => void;
}

interface LoadingState {
  isLoadingBackdropOpen: boolean;
  setIsLoadingBackdropOpen: (isOpen: boolean) => void;
}

interface DialogState {
  isGetTypeOfKeyDialogOpen: boolean;
  isDeleteKeyDialogOpen: boolean;
  isDeleteAllKeysDialogOpen: boolean;
  isSetStringDialogOpen: boolean;
  isGetStringDialogOpen: boolean;
  isSetHashMapDialogOpen: boolean;
  isGetHashMapFieldValueDialogOpen: boolean;
  isGetAllHashMapFieldsAndValuesDialogOpen: boolean;
  isDeleteHashMapFieldsDialogOpen: boolean;
  setIsGetTypeOfKeyDialogOpen: (isOpen: boolean) => void;
  setIsDeleteKeyDialogOpen: (isOpen: boolean) => void;
  setIsDeleteAllKeysDialogOpen: (isOpen: boolean) => void;
  setIsSetStringDialogOpen: (isOpen: boolean) => void;
  setIsGetStringDialogOpen: (isOpen: boolean) => void;
  setIsSetHashMapDialogOpen: (isOpen: boolean) => void;
  setIsGetHashMapFieldValueDialogOpen: (isOpen: boolean) => void;
  setIsGetAllHashMapFieldsAndValuesDialogOpen: (isOpen: boolean) => void;
  setIsDeleteHashMapFieldsDialogOpen: (isOpen: boolean) => void;
}

interface ThemeState {
  isDarkMode: boolean;
  setDarkMode: (enable: boolean) => void;
}

export const useConnectionInfoStore = create<ConnectionInfoState>((set) => ({
  connectionInfo: {
    host: "",
    port: 0,
    defaultDb: "default",
    password: "",
    tlsCertFilePath: "",
    isUsePassword: false,
    isUseTLS: false,
  },
  isConnected: false,
  setConnectionInfo: (newConnectionInfo) =>
    set(() => ({ connectionInfo: newConnectionInfo })),
  setDefaultDb: (name) =>
    set((state) => ({
      connectionInfo: { ...state.connectionInfo, defaultDb: name },
    })),
  setIsConnected: (isConnected) =>
    set(() => ({ isConnected: isConnected })),
}));

export const useServerInfoStore = create<ServerInfoState>((set) => ({
  serverInfo: null,
  setServerInfo: (newServerInfo) => set(() => ({ serverInfo: newServerInfo })),
}));

export const useNavigationStore = create<NavigationState>((set) => ({
  selectedNavItemIndex: 0,
  setSelectedNavItemIndex: (newIndex) =>
    set(() => ({ selectedNavItemIndex: newIndex })),
}));

export const useAlertBoxStore = create<AlertBoxState>((set) => ({
  isOpen: false,
  message: "",
  severity: "success",
  open: () => set(() => ({ isOpen: true })),
  close: () => set(() => ({ isOpen: false })),
  setContent: (message, severity) => set(() => ({ message, severity })),
}));

export const useDatabaseStore = create<DatabaseState>((set) => ({
  databases: null,
  setDatabases: (newDatabases) => {
    if (newDatabases) sortAlphabetically(newDatabases);
    set(() => ({ databases: newDatabases }));
  },
  getAllDatabases: () => {
    invokeGetAllDatabases()
      .then((result) => {
        sortAlphabetically(result.dbNames);
        set(() => ({ databases: result.dbNames }));
      })
      .catch((err) => {
        set(() => ({ databases: null }));
        errorAlert(`Failed to show databases: ${err}`);
      });
  },
}));

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoadingBackdropOpen: false,
  setIsLoadingBackdropOpen: (isOpen) =>
    set(() => ({ isLoadingBackdropOpen: isOpen })),
}));

export const useDialogStore = create<DialogState>((set) => ({
  isGetTypeOfKeyDialogOpen: false,
  isDeleteKeyDialogOpen: false,
  isDeleteAllKeysDialogOpen: false,
  isSetStringDialogOpen: false,
  isGetStringDialogOpen: false,
  isSetHashMapDialogOpen: false,
  isGetHashMapFieldValueDialogOpen: false,
  isGetAllHashMapFieldsAndValuesDialogOpen: false,
  isDeleteHashMapFieldsDialogOpen: false,
  setIsGetTypeOfKeyDialogOpen: (isOpen) =>
    set(() => ({ isGetTypeOfKeyDialogOpen: isOpen })),
  setIsDeleteKeyDialogOpen: (isOpen) =>
    set(() => ({ isDeleteKeyDialogOpen: isOpen })),
  setIsDeleteAllKeysDialogOpen: (isOpen) =>
    set(() => ({ isDeleteAllKeysDialogOpen: isOpen })),
  setIsSetStringDialogOpen: (isOpen) =>
    set(() => ({ isSetStringDialogOpen: isOpen })),
  setIsGetStringDialogOpen: (isOpen) =>
    set(() => ({ isGetStringDialogOpen: isOpen })),
  setIsSetHashMapDialogOpen: (isOpen) =>
    set(() => ({ isSetHashMapDialogOpen: isOpen })),
  setIsGetHashMapFieldValueDialogOpen: (isOpen) =>
    set(() => ({ isGetHashMapFieldValueDialogOpen: isOpen })),
  setIsGetAllHashMapFieldsAndValuesDialogOpen: (isOpen) =>
    set(() => ({ isGetAllHashMapFieldsAndValuesDialogOpen: isOpen })),
  setIsDeleteHashMapFieldsDialogOpen: (isOpen) =>
    set(() => ({ isDeleteHashMapFieldsDialogOpen: isOpen })),
}));

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: false,
  setDarkMode: (enable: boolean) => set(() => ({ isDarkMode: enable })),
}));
