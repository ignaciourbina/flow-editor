/**
 * @module hooks/index
 * @description Barrel export for all custom hooks.
 *
 * @owner Shared
 */

export { useFlowStore } from './useFlowStore';
export { useUndoRedo } from './useUndoRedo';
export type { UndoRedoControls } from './useUndoRedo';
export { useKeyboardShortcuts } from './useKeyboardShortcuts';
export { useAutoSave } from './useAutoSave';
export { useNodeHandleReposition } from './useNodeHandleReposition';
export type { NodeHandleRepositionControls } from './useNodeHandleReposition';
export { useCanvasContextMenus } from './useCanvasContextMenus';
export type {
  CanvasContextMenusControls,
  PaneMenuState,
  EdgeMenuState,
  NodeMenuState,
} from './useCanvasContextMenus';
