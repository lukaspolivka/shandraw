import { create, StateCreator } from 'zustand';
import { AuthSlice, createAuthSlice } from './slices/createAuthSlice';
import { createProjectSlice, type ProjectSlice } from './slices/createProjectSlice';
import { createUISlice, UISlice } from './slices/createUISlice';
import { createSchemaSlice, SchemaSlice } from './slices/createSchemaSlice';
import { createDiagramSlice, DiagramSlice } from './slices/createDiagramSlice';

export type AppStore = AuthSlice & ProjectSlice & SchemaSlice & UISlice & DiagramSlice;

export type StoreSlice<T> = StateCreator<AppStore, [], [], T>;

export const useAppStore = create<AppStore>()((...args) => ({
  ...createUISlice(...args),
  ...createProjectSlice(...args),
  ...createSchemaSlice(...args),
  ...createDiagramSlice(...args),
  ...createAuthSlice(...args),
}));
