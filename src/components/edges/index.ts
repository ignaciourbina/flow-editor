/**
 * @module components/edges/index
 * @description Barrel export and edge type registry map.
 * React Flow uses this map to resolve custom edge types.
 *
 * @owner Team Gamma (UI Components)
 */

import type { EdgeTypes } from '@xyflow/react';
import DefaultEdge from './DefaultEdge';
import ConditionalEdge from './ConditionalEdge';

// Re-export individual components
export { default as DefaultEdge } from './DefaultEdge';
export { default as ConditionalEdge } from './ConditionalEdge';

/**
 * Edge type registry consumed by `<ReactFlow edgeTypes={edgeTypes} />`.
 *
 * NOTE: The registry requires a type assertion because React Flow's EdgeTypes
 * expects untyped components (EdgeProps), but our components use TypedEdgeProps.
 * This is the ONLY location where an 'as' cast is used for edges — all component
 * files are now type-safe without casts.
 */
export const edgeTypes: EdgeTypes = {
  default: DefaultEdge,
  conditional: ConditionalEdge,
} as EdgeTypes;
