import { create } from 'zustand'
import { ConnectionInfo } from '../types/types'

interface ConnectionInfoState {
  connectionInfo: ConnectionInfo,
  setConnectionInfo: (newConnectionInfo: ConnectionInfo) => void,
}

export const useConnectionInfoStore = create<ConnectionInfoState>((set) => ({
  connectionInfo: { host: "", port: 0 },
  setConnectionInfo: (newConnectionInfo) => set(() => ({ connectionInfo: newConnectionInfo })),
}))