import { create } from 'zustand';

interface NetworkState {
  isBackendOnline: boolean;
  isTimeout: boolean;
  isAuthExpired: boolean;
  isServerError: boolean;
  setBackendStatus: (status: {
    isBackendOnline: boolean;
    isTimeout?: boolean;
    isAuthExpired?: boolean;
    isServerError?: boolean;
  }) => void;
  resetStatus: () => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  isBackendOnline: true,
  isTimeout: false,
  isAuthExpired: false,
  isServerError: false,
  setBackendStatus: (status) => set((state) => ({ ...state, ...status })),
  resetStatus: () => set({
    isBackendOnline: true,
    isTimeout: false,
    isAuthExpired: false,
    isServerError: false,
  }),
}));
