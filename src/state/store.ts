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