/**
 * @module lib/factories/projectFactory
 * @description Factory for creating new project instances with sensible defaults.
 *
 * @owner Team Beta (State & Logic)
 * @dependencies types/project
 */

import { nanoid } from 'nanoid';
import type { FlowProject, ProjectDomain } from '@/types';
import { DEFAULT_PROJECT_SETTINGS, CURRENT_SCHEMA_VERSION } from '@/types';

/**
 * Generates a unique project ID prefixed with `proj_`.
 * @returns A unique string identifier for a project.
 */
export function createProjectId(): string {
  return `proj_${nanoid(12)}`;
}

/**
 * Creates a new {@link FlowProject} with an empty flow and default settings.
 * @param name - Human-readable project name.
 * @param domain - Project domain category (defaults to `'general'`).
 * @returns A fully initialised FlowProject.
 */
export function createProject(
  name: string,
  domain: ProjectDomain = 'general',
): FlowProject {
  const now = new Date().toISOString();
  return {
    id: createProjectId(),
    name,
    domain,
    createdAt: now,
    updatedAt: now,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    flow: {
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    },
    settings: { ...DEFAULT_PROJECT_SETTINGS },
  };
}
