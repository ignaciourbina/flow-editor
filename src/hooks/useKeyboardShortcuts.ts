/**
 * @module hooks/useKeyboardShortcuts
 * @description Hook registering global keyboard shortcuts for the flow editor.
 * Binds: Ctrl+Z (undo), Ctrl+Shift+Z (redo), Delete (delete selected),
 * Ctrl+A (select all), Escape (deselect), Ctrl+K (command palette).
 * Ignores events when the user is typing in input/textarea/contenteditable elements.
 *
 * @owner Team Gamma (Integration + Hooks)
 * @dependencies stores/flowStore, stores/uiStore
 */

import { useEffect } from 'react';
import { useFlowStore } from '@/stores/flowStore';
import { useUIStore } from '@/stores/uiStore';

/** Tag names where keyboard shortcuts should be suppressed. */
const EDITABLE_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

/**
 * Returns `true` if the event target is an editable element that should
 * consume keyboard input rather than trigger a shortcut.
 */
function isEditableTarget(event: KeyboardEvent): boolean {
  const target = event.target as HTMLElement | null;
  if (!target) return false;
  if (EDITABLE_TAGS.has(target.tagName)) return true;
  if (target.isContentEditable) return true;
  return false;
}

/**
 * Hook registering global keyboard shortcuts.
 *
 * Must be called once at the top level of the application (e.g., in `App`).
 * Cleans up the event listener on unmount.
 */
export function useKeyboardShortcuts(): void {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (isEditableTarget(event)) return;

      const ctrl = event.ctrlKey || event.metaKey;

      // Ctrl+Z — Undo
      if (ctrl && !event.shiftKey && event.key === 'z') {
        event.preventDefault();
        useFlowStore.getState().undo();
        return;
      }

      // Ctrl+Shift+Z — Redo
      if (ctrl && event.shiftKey && event.key === 'Z') {
        event.preventDefault();
        useFlowStore.getState().redo();
        return;
      }

      // Delete / Backspace — Remove selected nodes
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        const { selectedNodeIds, removeNode } = useFlowStore.getState();
        selectedNodeIds.forEach((id: string) => removeNode(id));
        return;
      }

      // Ctrl+A — Select all
      if (ctrl && event.key === 'a') {
        event.preventDefault();
        useFlowStore.getState().selectAll();
        return;
      }

      // Escape — Clear selection / close command palette
      if (event.key === 'Escape') {
        event.preventDefault();
        const ui = useUIStore.getState();
        if (ui.isCommandPaletteOpen) {
          ui.closeCommandPalette();
        } else {
          useFlowStore.getState().clearSelection();
        }
        return;
      }

      // Ctrl+K — Toggle command palette
      if (ctrl && event.key === 'k') {
        event.preventDefault();
        const ui = useUIStore.getState();
        if (ui.isCommandPaletteOpen) {
          ui.closeCommandPalette();
        } else {
          ui.openCommandPalette();
        }
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
