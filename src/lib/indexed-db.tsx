import config from '@/config';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Node, Edge } from 'reactflow';

const DB_NAME = `${config.app_name}DB`;
const DB_VERSION = 1;
const STORE_NAME = 'projects';

export interface ProjectData {
  id: string;
  projectName: string;
  schemaCode: string;
  nodes: Node[];
  edges: Edge[];
  updatedAt: string;
  isPublic: boolean;
  shareId: string | null;
  isDirty?: boolean;
}

interface ShandrawDBSchema extends DBSchema {
  [STORE_NAME]: {
    key: string;
    value: ProjectData;
    indexes: { 'by-updatedAt': string };
  };
}

let dbPromise: Promise<IDBPDatabase<ShandrawDBSchema>> | null = null;

const getDb = (): Promise<IDBPDatabase<ShandrawDBSchema>> => {
  if (!dbPromise) {
    dbPromise = openDB<ShandrawDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('by-updatedAt', 'updatedAt');
      },
    });
  }
  return dbPromise;
};

export async function saveProjectToDB(project: ProjectData): Promise<void> {
  const db = await getDb();
  await db.put(STORE_NAME, project);
}

export async function getProjectFromDB(id: string): Promise<ProjectData | undefined> {
  const db = await getDb();
  return db.get(STORE_NAME, id);
}

export async function getAllProjectsFromDB(): Promise<ProjectData[]> {
  const db = await getDb();
  const projects = await db.getAll(STORE_NAME);
  // Sort in memory as getAllFromIndex doesn't support descending order directly
  return projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function deleteProjectFromDB(id: string): Promise<void> {
  const db = await getDb();
  await db.delete(STORE_NAME, id);
}

export async function clearAllProjectsFromDB(): Promise<void> {
  const db = await getDb();
  await db.clear(STORE_NAME);
}
