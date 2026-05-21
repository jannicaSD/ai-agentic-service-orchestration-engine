import { create } from 'zustand';

interface AppState {
  theme: 'dark' | 'light';
  isInitialized: boolean;
  userLocation: { latitude: number; longitude: number } | null;
  setTheme: (theme: 'dark' | 'light') => void;
  setInitialized: (state: boolean) => void;
  setUserLocation: (location: { latitude: number; longitude: number }) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark', // strictly dark mode by default
  isInitialized: false,
  userLocation: null,
  setTheme: (theme) => set({ theme }),
  setInitialized: (state) => set({ isInitialized: state }),
  setUserLocation: (location) => set({ userLocation: location }),
}));
