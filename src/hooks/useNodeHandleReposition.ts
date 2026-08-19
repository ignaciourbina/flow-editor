/**
 * @module hooks/useNodeHandleReposition
 * @description Hook providing handle repositioning logic for nodes with movable handles.
 * Centralizes the logic for updating source/target positions when handles are dragged.
 *
 * @owner Team Gamma (Integration + Hooks)
 * @dependencies stores/flowStore, @xyflow/react
 */

import { useCallback } from 'react';
import { Position } from '@xyflow/react';
import { useFlowStore } from '@/stores/flowStore';

/** Return type for the useNodeHandleReposition hook. */
export interface NodeHandleRepositionControls {
  /**
   * Update the position of a handle (source or target).
   * @param handleType - The type of handle to reposition ('source' or 'target').
   * @param toPosition - The new position for the handle (Top, Right, Bottom, Left).
   */
  handleReposition: (handleType: 'source' | 'target', toPosition: Position) => void;
}

/**
 * Hook providing handle repositioning logic for nodes.
 *
 * Used by node components that allow dynamic handle positioning (e.g., StartEndNode, NoteNode).
 *
 * @param nodeId - The ID of the node whose handles should be repositioned.
 * @returns An object with a `handleReposition` callback.
 *
 * @example
 * ```tsx
 * const { handleReposition } = useNodeHandleReposition(id);
 * // Later in the component:
 * handleReposition('source', Position.Right);
 * ```
 */
export function useNodeHandleReposition(nodeId: string): NodeHandleRepositionControls {
  const updateNode = useFlowStore((s) => s.updateNode);

  const handleReposition = useCallback(
    (handleType: 'source' | 'target', toPosition: Position) => {
      updateNode(nodeId, handleType === 'source' ? { sourcePosition: toPosition } : { targetPosition: toPosition });
    },
    [nodeId, updateNode],
  );

  return { handleReposition };
}
