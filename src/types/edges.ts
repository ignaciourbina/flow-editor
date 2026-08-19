/**
 * @module types/edges
 * @description Core type definitions for all edge types in the flow editor.
 *
 * @owner Team Alpha (Foundation)
 * @dependencies None (leaf module)
 */

import type { Edge, MarkerType } from '@xyflow/react';

// ---------------------------------------------------------------------------
// Edge type identifiers
// ---------------------------------------------------------------------------

/** All available edge type identifiers. */
export type EdgeType = 'default' | 'conditional' | 'data' | 'async';

// ---------------------------------------------------------------------------
// Edge data interfaces
// ---------------------------------------------------------------------------

/** Base data payload for edges. */
export interface BaseEdgeData {
  /** Index signature required by @xyflow/react Edge<T> constraint. */
  [key: string]: unknown;
  /** Optional label displayed on the edge path. */
  label?: string;
}

/** Data specific to conditional (branching) edges. */
export interface ConditionalEdgeData extends BaseEdgeData {
  /** The condition result this branch represents. */
  condition: 'yes' | 'no' | string;
}

/** Data specific to data-flow edges (dashed style). */
export interface DataEdgeData extends BaseEdgeData {
  /** The data being transferred along this edge. */
  dataType?: string;
}

/** Data specific to async/event edges (dotted style). */
export interface AsyncEdgeData extends BaseEdgeData {
  /** The event name that triggers this edge. */
  eventName?: string;
}

// ---------------------------------------------------------------------------
// Edge data type map
// ---------------------------------------------------------------------------

/** Maps each EdgeType to its corresponding data interface. */
export interface EdgeDataMap {
  default: BaseEdgeData;
  conditional: ConditionalEdgeData;
  data: DataEdgeData;
  async: AsyncEdgeData;
}

// ---------------------------------------------------------------------------
// FlowEdge — the primary edge type used throughout the app
// ---------------------------------------------------------------------------

/**
 * Strongly-typed flow edge extending React Flow's Edge type.
 *
 * @example
 * const edge: FlowEdge<'conditional'> = {
 *   id: 'e1',
 *   source: 'n1',
 *   target: 'n2',
 *   type: 'conditional',
 *   data: { condition: 'yes', label: 'Approved' },
 * };
 */
export type FlowEdge<T extends EdgeType = EdgeType> = Edge<EdgeDataMap[T], T>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Array of all edge type identifiers. */
export const EDGE_TYPES: readonly EdgeType[] = [
  'default',
  'conditional',
  'data',
  'async',
] as const;

/** Type guard: checks if a string is a valid EdgeType. */
export function isEdgeType(value: string): value is EdgeType {
  return (EDGE_TYPES as readonly string[]).includes(value);
}

/** Default marker configuration for edge arrows. */
export const DEFAULT_EDGE_MARKER: { type: MarkerType } = {
  type: 'arrowclosed' as MarkerType,
};
