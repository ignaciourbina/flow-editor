/**
 * @module lib/persistence/indexedDb
 * @description IndexedDB wrapper for auto-saving and loading projects locally.
 *
 * @owner Team Delta (Persistence & Export)
 * @dependencies idb-keyval, types/project
 */

import { get, set, del, keys } from 'idb-keyval';
import type { FlowProject, ProjectSummary } from '@/types';

/** Key prefix used for all project entries in IndexedDB. */
const PROJECT_PREFIX = 'flow_project_';

/** Builds the IndexedDB key for a given project ID. */
function projectKey(id: string): string {
  return `${PROJECT_PREFIX}${id}`;
}

/**
 * Saves a FlowProject to IndexedDB.
 *
 * @param project - The project to persist.
 */
export async function saveProject(project: FlowProject): Promise<void> {
  const json = JSON.stringify(project);
  await set(projectKey(project.id), json);
}

/**
 * Loads a FlowProject from IndexedDB by its ID.
 *
 * @param id - The project identifier.
 * @returns The loaded project, or null if not found.
 */
export async function loadProject(id: string): Promise<FlowProject | null> {
  const raw: string | undefined = await get(projectKey(id));
  if (raw === undefined) {
    return null;
  }
  return JSON.parse(raw) as FlowProject;
}

/**
 * Deletes a FlowProject from IndexedDB.
 *
 * @param id - The project identifier to remove.
 */
export async function deleteProject(id: string): Promise<void> {
  await del(projectKey(id));
}

/**
 * Lists all saved projects as lightweight summaries.
 *
 * @returns An array of ProjectSummary objects sorted by updatedAt descending.
 */
export async function listProjects(): Promise<ProjectSummary[]> {
  const allKeys = await keys();
  const projectKeys = allKeys.filter(
    (k): k is string => typeof k === 'string' && k.startsWith(PROJECT_PREFIX),
  );

  const summaries: ProjectSummary[] = [];

  for (const key of projectKeys) {
    const raw: string | undefined = await get(key);
    if (raw === undefined) continue;

    const project = JSON.parse(raw) as FlowProject;
    summaries.push({
      id: project.id,
      name: project.name,
      domain: project.domain,
      updatedAt: project.updatedAt,
      nodeCount: project.flow.nodes.length,
    });
  }

  summaries.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return summaries;
}
