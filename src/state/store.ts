import { create } from 'zustand'
import { ConnectionInfo } from '../types/types'
import { ServerInfo } from '../types/server'

interface ConnectionInfoState {
  connectionInfo: ConnectionInfo,
  setConnectionInfo: (newConnectionInfo: ConnectionInfo) => void,
}

interface ServerInfoState {
  serverInfo: ServerInfo | null,
  setServerInfo: (newServerInfo: ServerInfo) => void,
}

interface NavigationState {
  selectedNavItemIndex: number,
  setSelectedNavItemIndex: (newIndex: number) => void,
}

interface DatabaseState {
  databases: string[] | null,
  setDatabases: (newDatabases: string[] | null) => void,
}

interface LoadingState {
  isLoadingBackdropOpen: boolean,
  setIsLoadingBackdropOpen: (isOpen: boolean) => void,
}

export const useConnectionInfoStore = create<ConnectionInfoState>((set) => ({
  connectionInfo: { host: "", port: 0 },
  setConnectionInfo: (newConnectionInfo) => set(() => ({ connectionInfo: newConnectionInfo })),
}));

export const useServerInfoStore = create<ServerInfoState>((set) => ({
  serverInfo: null,
  setServerInfo: (newServerInfo) => set(() => ({ serverInfo: newServerInfo })),
}));

export const useNavigationStore = create<NavigationState>((set) => ({
  selectedNavItemIndex: 0,
  setSelectedNavItemIndex: (newIndex) => set(() => ({ selectedNavItemIndex: newIndex })),
}));

export const useDatabaseStore = create<DatabaseState>((set) => ({
  databases: null,
  setDatabases: (newDatabases) => set(() => ({ databases: newDatabases })),
}));

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoadingBackdropOpen: false,
  setIsLoadingBackdropOpen: (isOpen) => set(() => ({isLoadingBackdropOpen: isOpen})),
}));