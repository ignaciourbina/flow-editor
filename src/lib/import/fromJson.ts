/**
 * @module lib/import/fromJson
 * @description Parses and validates a JSON string into a FlowProject object.
 *
 * @owner Team Delta (Persistence & Export)
 * @dependencies types/project
 */

import type { FlowProject, ProjectSettings } from '@/types';
import { CURRENT_SCHEMA_VERSION, DEFAULT_PROJECT_SETTINGS } from '@/types';

/** Custom error class for import failures. */
export class ImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImportError';
  }
}

/**
 * Asserts that a value is a non-null object.
 *
 * @throws ImportError if `val` is not an object.
 */
function assertObject(val: unknown, context: string): asserts val is Record<string, unknown> {
  if (typeof val !== 'object' || val === null || Array.isArray(val)) {
    throw new ImportError(`${context} must be a non-null object`);
  }
}

/**
 * Asserts that a required string field exists on an object.
 *
 * @throws ImportError if the field is missing or not a string.
 */
function requireString(obj: Record<string, unknown>, field: string, context: string): string {
  const val = obj[field];
  if (typeof val !== 'string' || val.length === 0) {
    throw new ImportError(`${context}.${field} must be a non-empty string`);
  }
  return val;
}

/**
 * Validates individual node objects within the flow.
 *
 * @throws ImportError if any node is invalid.
 */
function validateNodes(nodes: unknown[]): void {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    assertObject(node, `flow.nodes[${i}]`);
    requireString(node, 'id', `flow.nodes[${i}]`);
    requireString(node, 'type', `flow.nodes[${i}]`);
    assertObject(node['position'] as unknown, `flow.nodes[${i}].position`);
    assertObject(node['data'] as unknown, `flow.nodes[${i}].data`);
  }
}

/**
 * Validates individual edge objects within the flow.
 *
 * @throws ImportError if any edge is invalid.
 */
function validateEdges(edges: unknown[]): void {
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    assertObject(edge, `flow.edges[${i}]`);
    requireString(edge, 'id', `flow.edges[${i}]`);
    requireString(edge, 'source', `flow.edges[${i}]`);
    requireString(edge, 'target', `flow.edges[${i}]`);
  }
}

/**
 * Parses a JSON string into a validated FlowProject.
 *
 * @param input - Raw JSON string.
 * @returns A validated FlowProject with defaults applied.
 * @throws ImportError if the JSON is malformed or missing required fields.
 */
export function fromJson(input: string): FlowProject {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch {
    throw new ImportError('Invalid JSON: unable to parse input string');
  }

  assertObject(parsed, 'Root');

  const id = requireString(parsed, 'id', 'Root');
  const name = requireString(parsed, 'name', 'Root');
  requireString(parsed, 'domain', 'Root');

  // Flow validation
  assertObject(parsed['flow'] as unknown, 'flow');
  const flow = parsed['flow'] as Record<string, unknown>;

  if (!Array.isArray(flow['nodes'])) {
    throw new ImportError('flow.nodes must be an array');
  }
  if (!Array.isArray(flow['edges'])) {
    throw new ImportError('flow.edges must be an array');
  }

  validateNodes(flow['nodes'] as unknown[]);
  validateEdges(flow['edges'] as unknown[]);

  // Settings — apply defaults for missing sub-fields
  const rawSettings = (parsed['settings'] ?? {}) as Partial<ProjectSettings>;
  const settings: ProjectSettings = {
    ...DEFAULT_PROJECT_SETTINGS,
    ...rawSettings,
  };

  const now = new Date().toISOString();
  const project: FlowProject = {
    id,
    name,
    description: typeof parsed['description'] === 'string' ? parsed['description'] : '',
    domain: parsed['domain'] as FlowProject['domain'],
    createdAt: typeof parsed['createdAt'] === 'string' ? parsed['createdAt'] : now,
    updatedAt: typeof parsed['updatedAt'] === 'string' ? parsed['updatedAt'] : now,
    schemaVersion: typeof parsed['schemaVersion'] === 'number'
      ? parsed['schemaVersion']
      : CURRENT_SCHEMA_VERSION,
    flow: {
      nodes: flow['nodes'] as FlowProject['flow']['nodes'],
      edges: flow['edges'] as FlowProject['flow']['edges'],
      viewport: flow['viewport'] as FlowProject['flow']['viewport'] ?? { x: 0, y: 0, zoom: 1 },
    },
    settings,
  };

  return project;
}
