/**
 * @module components/panels/node-palette/DraggableNodeItem
 * @description Individual draggable node item in the palette.
 * Sets `application/flow-editor-node` transfer data so the canvas can
 * instantiate the correct node type on drop.
 *
 * @owner Team Gamma (UI Components)
 * @dependencies types/nodes
 */

import React, { useCallback } from 'react';
import { ADD_NODE_EVENT } from '@/lib/constants';
import { useUiStore } from '@/stores/uiStore';

/** Props for a single draggable palette item. */
export interface DraggableNodeItemProps {
  /** The node type identifier written to dataTransfer. */
  nodeType: string;
  /** Human-readable label shown next to the icon. */
  label: string;
  /** Icon element rendered at the left of the card. */
  icon: React.ReactNode;
  /** Accent color rendered as a left border stripe. */
  color: string;
}

/**
 * A small card representing a node type in the palette.
 * The user drags it onto the canvas to create a new node, or clicks (taps) it
 * to add one at the centre of the canvas.
 */
export function DraggableNodeItem({
  nodeType,
  label,
  icon,
  color,
}: DraggableNodeItemProps): React.ReactElement {
  const handleDragStart = useCallback(
    (event: React.DragEvent<HTMLDivElement>): void => {
      event.dataTransfer.setData('application/flow-editor-node', nodeType);
      event.dataTransfer.effectAllowed = 'move';
    },
    [nodeType],
  );

  const handleAdd = useCallback((): void => {
    window.dispatchEvent(new CustomEvent(ADD_NODE_EVENT, { detail: nodeType }));
    // On narrow screens the palette covers the canvas; close it to show the new node.
    const { activePanel, togglePanel } = useUiStore.getState();
    if (activePanel === 'palette') togglePanel('palette');
  }, [nodeType]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>): void => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      handleAdd();
    },
    [handleAdd],
  );

  return (
    <div
      draggable="true"
      role="button"
      tabIndex={0}
      onDragStart={handleDragStart}
      onClick={handleAdd}
      onKeyDown={handleKeyDown}
      className="flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700
                 bg-white dark:bg-gray-900 px-2 py-1.5 cursor-grab
                 hover:shadow-sm active:cursor-grabbing select-none transition-shadow"
      style={{ borderLeftColor: color, borderLeftWidth: 3 }}
      title={`Drag to add a ${label} node`}
    >
      <span className="text-gray-500 dark:text-gray-400 shrink-0">{icon}</span>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
        {label}
      </span>
    </div>
  );
}
