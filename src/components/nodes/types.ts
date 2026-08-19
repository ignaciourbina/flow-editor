/**
 * @module components/nodes/types
 * @description Type-safe wrappers for React Flow node and edge component props.
 * Eliminates unsafe `as unknown as` casts by narrowing data types at the component boundary.
 *
 * @owner Team Gamma (UI Components)
 * @dependencies types/nodes, types/edges, @xyflow/react
 */

import type { NodeProps, EdgeProps } from '@xyflow/react';
import type { NodeType, NodeDataMap, EdgeType, EdgeDataMap } from '@/types';

// ---------------------------------------------------------------------------
// Type-safe node props wrapper
// ---------------------------------------------------------------------------

/**
 * Type-safe wrapper for React Flow NodeProps that narrows the `data` field
 * to the correct data interface based on the node type.
 *
 * Replaces unsafe `as unknown as` casts with compile-time type safety.
 *
 * @template T - The specific NodeType (e.g., 'process', 'decision')
 *
 * @example
 * ```tsx
 * const ProcessNode: React.FC<TypedNodeProps<'process'>> = ({ data, selected }) => {
 *   // data is automatically typed as BaseNodeData
 *   return <BaseNode label={data.label} selected={selected} />;
 * };
 * ```
 */
export type TypedNodeProps<T extends NodeType> = Omit<NodeProps, 'data'> & {
  data: NodeDataMap[T];
};

// ---------------------------------------------------------------------------
// Type-safe edge props wrapper
// ---------------------------------------------------------------------------

/**
 * Type-safe wrapper for React Flow EdgeProps that narrows the `data` field
 * to the correct data interface based on the edge type.
 *
 * Replaces unsafe type casts with compile-time type safety.
 *
 * @template T - The specific EdgeType (e.g., 'default', 'conditional')
 *
 * @example
 * ```tsx
 * const ConditionalEdge: React.FC<TypedEdgeProps<'conditional'>> = ({ data, ...props }) => {
 *   // data is automatically typed as ConditionalEdgeData | undefined
 *   const label = data?.condition ?? '';
 *   return <BaseEdge {...props} />;
 * };
 * ```
 */
export type TypedEdgeProps<T extends EdgeType> = Omit<EdgeProps, 'data'> & {
  data?: EdgeDataMap[T];
};
