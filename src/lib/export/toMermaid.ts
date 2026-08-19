/**
 * @module lib/export/toMermaid
 * @description Converts flow state to Mermaid diagram syntax.
 *
 * @owner Team Delta (Persistence & Export)
 * @dependencies types/nodes, types/edges, types/project
 */

import type { FlowState } from '@/types';
import type { FlowNode, NodeType } from '@/types';
import type { FlowEdge, EdgeType } from '@/types';

/**
 * Sanitizes a node ID so it is valid in Mermaid syntax.
 * Replaces any non-alphanumeric character with an underscore.
 */
function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9]/g, '_');
}

/** Returns the Mermaid shape wrapper for a given node type. */
function nodeShape(type: NodeType | string, label: string): string {
  switch (type as NodeType) {
    case 'start':
    case 'end':
      return `([${label}])`;
    case 'decision':
      return `{${label}}`;
    case 'note':
      return `>${label}]`;
    case 'process':
    default:
      return `[${label}]`;
  }
}

/** Returns the Mermaid arrow string for a given edge type and optional label. */
function edgeArrow(type: EdgeType | string, label?: string): string {
  const safeLabel = label ?? '';
  switch (type as EdgeType) {
    case 'conditional':
      return safeLabel ? `-->|${safeLabel}|` : `-->`;
    case 'data':
      return safeLabel ? `-.->|${safeLabel}|` : `-.->`;
    case 'async':
      return safeLabel ? `==>|${safeLabel}|` : `==>`;
    case 'default':
    default:
      return safeLabel ? `-->|${safeLabel}|` : `-->`;
  }
}

/**
 * Converts a FlowState to Mermaid flowchart syntax.
 *
 * @param flow - The flow state containing nodes and edges.
 * @returns A Mermaid flowchart definition string.
 */
export function toMermaid(flow: FlowState): string {
  const lines: string[] = ['flowchart TD'];

  // Node definitions
  for (const node of flow.nodes as FlowNode[]) {
    const id = sanitizeId(node.id);
    const label = (node.data as { label?: string }).label ?? node.id;
    const shape = nodeShape(node.type ?? 'process', label);
    lines.push(`  ${id}${shape}`);
  }

  // Edge connections
  for (const edge of flow.edges as FlowEdge[]) {
    const src = sanitizeId(edge.source);
    const tgt = sanitizeId(edge.target);
    const label = (edge.data as { label?: string; condition?: string })?.label
      ?? (edge.data as { condition?: string })?.condition
      ?? '';
    const arrow = edgeArrow(edge.type ?? 'default', label);
    lines.push(`  ${src} ${arrow} ${tgt}`);
  }

  return lines.join('\n');
}
