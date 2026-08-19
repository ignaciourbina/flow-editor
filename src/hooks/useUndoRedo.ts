/**
 * @module hooks/useUndoRedo
 * @description Hook providing undo/redo actions and their availability state.
 * Selects the relevant slice from the flow store for convenient access.
 *
 * @owner Team Gamma (Integration + Hooks)
 * @dependencies stores/flowStore
 */

import { useFlowStore } from '@/stores/flowStore';

/** Return type for the useUndoRedo hook. */
export interface UndoRedoControls {
  /** Undo the last action. */
  undo: () => void;
  /** Redo the last undone action. */
  redo: () => void;
  /** Whether there is an action available to undo. */
  canUndo: boolean;
  /** Whether there is an action available to redo. */
  canRedo: boolean;
}

/**
 * Hook providing undo/redo actions and state.
 *
 * @returns An object with `undo`, `redo`, `canUndo`, and `canRedo`.
 *
 * @example
 * ```tsx
 * const { undo, redo, canUndo, canRedo } = useUndoRedo();
 * ```
 */
export function useUndoRedo(): UndoRedoControls {
  const undo = useFlowStore((s) => s.undo);
  const redo = useFlowStore((s) => s.redo);
  const canUndo = useFlowStore((s) => s.past.length > 0);
  const canRedo = useFlowStore((s) => s.future.length > 0);

  return { undo, redo, canUndo, canRedo };
}
