import { create } from 'zustand';
import { createAuthSlice } from './slices/createAuthSlice';
import type { AuthSlice } from './slices/createAuthSlice';

export type AppStore = AuthSlice;

export const useAppStore = create<AppStore>()((...args) => ({
  ...createAuthSlice(...args),
}));
