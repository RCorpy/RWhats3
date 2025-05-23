// src/stores/connectionStore.ts
import { create } from 'zustand';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface ConnectionStore {
  apiStatus: ConnectionStatus;
  socketStatus: ConnectionStatus;
  setApiStatus: (status: ConnectionStatus) => void;
  setSocketStatus: (status: ConnectionStatus) => void;
}

export const useConnectionStore = create<ConnectionStore>()((set) => ({
  apiStatus: 'disconnected',
  socketStatus: 'disconnected',
  setApiStatus: (status) => set({ apiStatus: status }),
  setSocketStatus: (status) => set({ socketStatus: status }),
}));
