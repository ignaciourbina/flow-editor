/**
 * @module lib/factories/edgeFactory
 * @description Factory functions for creating typed edge instances.
 *
 * @owner Team Beta (State & Logic)
 * @dependencies types/edges
 */

import { nanoid } from 'nanoid';
import type { EdgeType, FlowEdge, EdgeDataMap } from '@/types';
import { DEFAULT_EDGE_MARKER } from '@/types';

/**
 * Generates a unique edge ID prefixed with `e_`.
 * @returns A unique string identifier for an edge.
 */
export function createEdgeId(): string {
  return `e_${nanoid(8)}`;
}

/**
 * Creates a fully typed {@link FlowEdge} with sensible defaults and arrow marker.
 * @param source - ID of the source node.
 * @param target - ID of the target node.
 * @param type - Edge type (defaults to `'default'`).
 * @param overrides - Optional partial data merged on top of defaults.
 * @returns A new FlowEdge ready to be added to the store.
 */
export function createEdge<T extends EdgeType = 'default'>(
  source: string,
  target: string,
  type: T | EdgeType = 'default',
  overrides?: Partial<EdgeDataMap[T]>,
): FlowEdge {
  const data = { ...overrides } as EdgeDataMap[T];
  return {
    id: createEdgeId(),
    source,
    target,
    type,
    data,
    markerEnd: DEFAULT_EDGE_MARKER,
  } as FlowEdge;
}
