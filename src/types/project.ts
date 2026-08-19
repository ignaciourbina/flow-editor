/**
 * @module types/project
 * @description Type definitions for project metadata, settings, and persistence schema.
 *
 * @owner Team Alpha (Foundation)
 * @dependencies types/nodes, types/edges
 */

import type { FlowNode, NodeType } from './nodes';
import type { FlowEdge } from './edges';

// ---------------------------------------------------------------------------
// Project domain
// ---------------------------------------------------------------------------

/** Available project domain categories. */
export type ProjectDomain =
  | 'general'
  | 'admin'
  | 'research'
  | 'api'
  | 'data'
  | 'system';

/** Array of all domain identifiers (for UI selectors). */
export const PROJECT_DOMAINS: readonly ProjectDomain[] = [
  'general',
  'admin',
  'research',
  'api',
  'data',
  'system',
] as const;

/** Human-readable labels for each domain. */
export const DOMAIN_LABELS: Record<ProjectDomain, string> = {
  general: 'General',
  admin: 'Administrative',
  research: 'Research',
  api: 'API & Services',
  data: 'Data Models',
  system: 'System Architecture',
};

// ---------------------------------------------------------------------------
// Project settings
// ---------------------------------------------------------------------------

/** Configurable editor settings stored per project. */
export interface ProjectSettings {
  /** Whether nodes snap to the grid when dragging. */
  snapToGrid: boolean;
  /** Grid size in pixels (default: 15). */
  gridSize: number;
  /** Whether the minimap overlay is visible. */
  showMinimap: boolean;
  /** UI theme preference. */
  theme: 'light' | 'dark' | 'system';
}

/** Default project settings applied to new projects. */
export const DEFAULT_PROJECT_SETTINGS: ProjectSettings = {
  snapToGrid: true,
  gridSize: 15,
  showMinimap: true,
  theme: 'system',
};

// ---------------------------------------------------------------------------
// Flow state (the diagram content)
// ---------------------------------------------------------------------------

/** The serializable diagram state: nodes, edges, and viewport. */
export interface FlowState {
  /** All nodes in the diagram. */
  nodes: FlowNode[];
  /** All edges (connections) in the diagram. */
  edges: FlowEdge[];
  /** Viewport position and zoom level. */
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
}

// ---------------------------------------------------------------------------
// FlowProject — the top-level persistence model
// ---------------------------------------------------------------------------

/**
 * Complete project model persisted to IndexedDB and exported as JSON.
 * This is the single source of truth for a saved diagram.
 */
export interface FlowProject {
  /** Unique project identifier (nanoid). */
  id: string;
  /** Human-readable project name. */
  name: string;
  /** Optional project description. */
  description?: string;
  /** The domain this project targets (affects palette filtering). */
  domain: ProjectDomain;
  /** ISO 8601 timestamp of project creation. */
  createdAt: string;
  /** ISO 8601 timestamp of last modification. */
  updatedAt: string;
  /** Schema version for future migration support. */
  schemaVersion: number;
  /** The diagram content. */
  flow: FlowState;
  /** Editor settings for this project. */
  settings: ProjectSettings;
}

/** Current schema version. Increment on breaking changes to FlowProject. */
export const CURRENT_SCHEMA_VERSION = 1;

// ---------------------------------------------------------------------------
// Project summary (used in project listings)
// ---------------------------------------------------------------------------

/** Lightweight project summary for listing without loading full flow data. */
export interface ProjectSummary {
  id: string;
  name: string;
  domain: ProjectDomain;
  updatedAt: string;
  nodeCount: number;
}

// ---------------------------------------------------------------------------
// Domain → NodeType mapping
// ---------------------------------------------------------------------------

/** Maps each domain to the node types available in its palette. */
export const DOMAIN_NODE_MAP: Record<ProjectDomain, readonly NodeType[]> = {
  general: ['start', 'end', 'process', 'decision', 'note'],
  admin: ['start', 'end', 'process', 'decision', 'note', 'approval', 'person', 'document'],
  research: ['start', 'end', 'process', 'decision', 'note', 'experiment', 'hypothesis', 'analysis', 'person', 'document'],
  api: ['start', 'end', 'process', 'decision', 'note', 'apiEndpoint', 'requestResponse', 'authToken', 'service', 'database', 'queue'],
  data: ['start', 'end', 'process', 'note', 'entity', 'relationship', 'database', 'analysis'],
  system: ['start', 'end', 'process', 'decision', 'note', 'service', 'server', 'database', 'queue', 'apiEndpoint', 'authToken'],
};
