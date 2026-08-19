/**
 * @module lib/validation/flowValidator
 * @description Validates flow structure: connectivity, orphan & reachability checks.
 *
 * @owner Team Beta (State & Logic)
 * @dependencies types/nodes, types/edges, types/ui
 */

import type { FlowNode, FlowEdge } from '@/types';
import type { ValidationResult, ValidationMessage } from '@/types';

/**
 * Validates the structural integrity of a flow diagram.
 *
 * Checks performed:
 * - `NO_START_NODE` (error) — at least one start node must exist.
 * - `NO_END_NODE` (warning) — at least one end node should exist.
 * - `ORPHAN_NODE` (warning) — nodes with zero connections (notes excluded).
 * - `UNREACHABLE_NODE` (warning) — nodes not reachable from any start via BFS.
 * - `DISCONNECTED_EDGE` (error) — edges referencing nonexistent node IDs.
 *
 * @param nodes - The array of flow nodes to validate.
 * @param edges - The array of flow edges to validate.
 * @returns A {@link ValidationResult} with `valid`, `warnings`, and `errors`.
 */
export function validateFlow(
  nodes: FlowNode[],
  edges: FlowEdge[],
): ValidationResult {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];
  const nodeIds = new Set(nodes.map((n) => n.id));

  // --- NO_START_NODE ---
  const startNodes = nodes.filter((n) => n.type === 'start');
  if (startNodes.length === 0) {
    errors.push({ code: 'NO_START_NODE', message: 'Flow has no start node.' });
  }

  // --- NO_END_NODE ---
  const endNodes = nodes.filter((n) => n.type === 'end');
  if (endNodes.length === 0) {
    warnings.push({ code: 'NO_END_NODE', message: 'Flow has no end node.' });
  }

  // --- DISCONNECTED_EDGE ---
  for (const edge of edges) {
    const missing: string[] = [];
    if (!nodeIds.has(edge.source)) missing.push(edge.source);
    if (!nodeIds.has(edge.target)) missing.push(edge.target);
    if (missing.length > 0) {
      errors.push({
        code: 'DISCONNECTED_EDGE',
        message: `Edge "${edge.id}" references nonexistent node(s).`,
        relatedIds: [edge.id, ...missing],
      });
    }
  }

  // Build adjacency sets for connectivity checks (only valid edges)
  const connected = new Set<string>();
  const adjacency = new Map<string, Set<string>>();
  for (const edge of edges) {
    if (nodeIds.has(edge.source) && nodeIds.has(edge.target)) {
      connected.add(edge.source);
      connected.add(edge.target);
      if (!adjacency.has(edge.source)) adjacency.set(edge.source, new Set());
      adjacency.get(edge.source)!.add(edge.target);
    }
  }

  // --- ORPHAN_NODE ---
  for (const node of nodes) {
    if (node.type === 'note') continue;
    if (!connected.has(node.id)) {
      warnings.push({
        code: 'ORPHAN_NODE',
        message: `Node "${node.id}" has no connections.`,
        relatedIds: [node.id],
      });
    }
  }

  // --- UNREACHABLE_NODE (BFS from all start nodes) ---
  const reachable = new Set<string>();
  const queue: string[] = startNodes.map((n) => n.id);
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (reachable.has(current)) continue;
    reachable.add(current);
    const neighbours = adjacency.get(current);
    if (neighbours) {
      for (const next of neighbours) {
        if (!reachable.has(next)) queue.push(next);
      }
    }
  }

  for (const node of nodes) {
    if (node.type === 'note') continue;
    if (!reachable.has(node.id)) {
      warnings.push({
        code: 'UNREACHABLE_NODE',
        message: `Node "${node.id}" is not reachable from any start node.`,
        relatedIds: [node.id],
      });
    }
  }

  return { valid: errors.length === 0, warnings, errors };
}
