/**
 * @module lib/export/assembleProject
 * @description Assembles a FlowProject from current state with validation.
 *
 * @owner Team Delta (Persistence & Export)
 * @dependencies types/project, types/ui, lib/validation
 */

import type { FlowProject, FlowNode, FlowEdge } from '@/types';
import type { ValidationResult } from '@/types';
import { CURRENT_SCHEMA_VERSION } from '@/types';
import { validateFlow } from '@/lib/validation';

/**
 * Result of project assembly including both the project and validation result.
 */
export interface AssembleProjectResult {
  /** The assembled FlowProject ready for export. */
  project: FlowProject;
  /** Validation result showing warnings and errors. */
  validation: ValidationResult;
}

/**
 * Assembles a FlowProject from nodes and edges, validates the flow structure,
 * and returns both the project and validation result.
 *
 * This function ensures that exports include validation feedback, allowing
 * users to see warnings (e.g., no end node) or errors (e.g., no start node)
 * before completing the export.
 *
 * @param nodes - The array of flow nodes.
 * @param edges - The array of flow edges.
 * @returns An object containing the assembled project and validation result.
 *
 * @example
 * ```ts
 * const { project, validation } = assembleFlowProject(nodes, edges);
 * if (validation.errors.length > 0) {
 *   console.warn('Export has errors:', validation.errors);
 * }
 * const json = toJson(project);
 * ```
 */
export function assembleFlowProject(
  nodes: FlowNode[],
  edges: FlowEdge[],
): AssembleProjectResult {
  const validation = validateFlow(nodes, edges);

  const project: FlowProject = {
    id: 'export',
    name: 'Untitled',
    domain: 'general',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    schemaVersion: CURRENT_SCHEMA_VERSION,
    flow: {
      nodes,
      edges,
      viewport: { x: 0, y: 0, zoom: 1 },
    },
    settings: {
      snapToGrid: true,
      gridSize: 15,
      showMinimap: true,
      theme: 'system',
    },
  };

  return { project, validation };
}
