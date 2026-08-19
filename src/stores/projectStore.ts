/**
 * @module stores/projectStore
 * @description Zustand store for project metadata: name, domain, timestamps, settings.
 *
 * @owner Team Beta (State & Logic)
 * @dependencies types/project
 */

import { create } from 'zustand';
import type { FlowProject, ProjectDomain, ProjectSettings } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Full shape of the project store (state + actions). */
export interface ProjectStoreState {
  // --- State ---
  /** The currently loaded project, or `null` before first load. */
  project: FlowProject | null;
  /** ISO 8601 timestamp of the last successful save, or `null`. */
  lastSaved: string | null;

  // --- Actions ---
  /** Replace the entire project object. */
  setProject: (project: FlowProject) => void;
  /** Update only the project name. */
  setProjectName: (name: string) => void;
  /** Update the project domain. */
  setProjectDomain: (domain: ProjectDomain) => void;
  /** Bump the `updatedAt` timestamp to the current ISO time. */
  updateTimestamp: () => void;
  /** Record the last-saved ISO timestamp. */
  setLastSaved: (iso: string) => void;
  /** Partially update the current project's settings. */
  updateProjectSettings: (updates: Partial<ProjectSettings>) => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useProjectStore = create<ProjectStoreState>()((set) => ({
  project: null,
  lastSaved: null,

  setProject: (project) => set({ project }),

  setProjectName: (name) =>
    set((s) => {
      if (!s.project) return s;
      return { project: { ...s.project, name, updatedAt: new Date().toISOString() } };
    }),

  setProjectDomain: (domain) =>
    set((s) => {
      if (!s.project) return s;
      return { project: { ...s.project, domain, updatedAt: new Date().toISOString() } };
    }),

  updateTimestamp: () =>
    set((s) => {
      if (!s.project) return s;
      return { project: { ...s.project, updatedAt: new Date().toISOString() } };
    }),

  setLastSaved: (iso) => set({ lastSaved: iso }),

  updateProjectSettings: (updates) =>
    set((s) => {
      if (!s.project) return s;
      return {
        project: {
          ...s.project,
          settings: { ...s.project.settings, ...updates },
          updatedAt: new Date().toISOString(),
        },
      };
    }),
}));
