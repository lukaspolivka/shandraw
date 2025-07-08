import config from '@/config';
import { toast } from '@/hooks/useToast';
import { saveProjectToDB } from '@/lib/indexed-db';
import { ProjectData } from '@/types';
import { format } from 'date-fns';

export const DBML_HELP_TEXT = `-- Welcome to ${(config.app_name || 'Draw') as string}!
-- Define your database schema using DBML (Database Markup Language).
-- Create a table:
Table users {
  id int [pk, increment]
  username varchar [unique, not null]
  created_at timestamp [default: \`now()\`]
}
-- Create another table:
Table posts {
  id int [pk, increment]
  title varchar
  user_id int [not null]
}
-- Define a relationship:
Ref: posts.user_id > users.id
-- Click the "Help" button for more examples.` as string;

export const getNewProjectName = () => `New Project - ${format(new Date(), 'PP')}`;

export const parseIfString = (data: any) => {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }
  return data || [];
};

export const syncProjectToServer = async (project: ProjectData) => {
  const token = localStorage.getItem(config.token_name);
  if (!token) return;
  try {
    const response = await fetch('/api/project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(project),
    });
    if (response.ok) {
      // Mark as not dirty in local DB upon successful sync
      await saveProjectToDB({ ...project, isDirty: false });
    }
  } catch (error) {
    console.error(`Failed to sync project ${project.id}:`, error);
  }
};

export async function saveToLocalDB(project: ProjectData) {
  try {
    await saveProjectToDB(project);
  } catch (err) {
    console.error('Failed to save project locally:', err);
    toast({
      variant: 'destructive',
      title: 'Local Save Failed',
      description: 'Could not save project locally.',
    });
  }
}
