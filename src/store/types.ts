import type { StateCreator } from 'zustand';

export type StoreSlice<T> = StateCreator<T, [], [], T>;
