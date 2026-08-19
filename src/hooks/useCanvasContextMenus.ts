/**
 * @module hooks/useCanvasContextMenus
 * @description Hook managing three independent context menu states for canvas interactions:
 * pane menu (add node), edge menu (edit edge type/marker), node menu (edit note content).
 * Returns typed state objects and handler functions for each menu type.
 *
 * @owner Team Gamma (Integration + Hooks)
 * @dependencies stores/flowStore
 */

import { useCallback, useEffect, useState } from 'react';
import type { EdgeMouseHandler, MarkerType, NodeMouseHandler } from '@xyflow/react';
import { useFlowStore } from '@/stores/flowStore';
import type { EdgeType, FlowNode } from '@/types';

/** State for the pane context menu (right-click canvas to add node). */
export interface PaneMenuState {
  x: number;
  y: number;
  position: { x: number; y: number };
}

/** State for the edge context menu (right-click edge to edit type/marker). */
export interface EdgeMenuState {
  x: number;
  y: number;
  edgeId: string;
}

/** State for the node context menu (right-click note to edit content). */
export interface NodeMenuState {
  x: number;
  y: number;
  nodeId: string;
  nodeType: FlowNode['type'];
}

/** Return type for the useCanvasContextMenus hook. */
export interface CanvasContextMenusControls {
  /** State for the pane context menu (null when closed). */
  paneMenu: PaneMenuState | null;
  /** State for the edge context menu (null when closed). */
  edgeMenu: EdgeMenuState | null;
  /** State for the node context menu (null when closed). */
  nodeMenu: NodeMenuState | null;
  /** Handler for pane context menu (right-click canvas). */
  onPaneContextMenu: (event: React.MouseEvent<HTMLDivElement>, screenToFlowPosition: (coords: { x: number; y: number }) => { x: number; y: number }) => void;
  /** Handler for edge context menu (right-click edge). */
  onEdgeContextMenu: EdgeMouseHandler;
  /** Handler for node context menu (right-click node). */
  onNodeContextMenu: NodeMouseHandler<FlowNode>;
  /** Close all context menus. */
  closeAllMenus: () => void;
  /** Update edge type and close edge menu. */
  updateEdgeType: (edgeId: string, type: EdgeType) => void;
  /** Update edge end marker and close edge menu. */
  updateEdgeEndMarker: (edgeId: string, marker: 'arrow' | 'none') => void;
  /** Insert a node at the pane menu position and close pane menu. */
  insertNodeAtMenuPosition: (type: FlowNode['type'], addNode: (node: FlowNode) => void, createNode: (type: FlowNode['type'], position: { x: number; y: number }) => FlowNode) => void;
}

/**
 * Hook managing canvas context menu states and handlers.
 *
 * Handles three independent context menus: pane (add node), edge (edit edge),
 * and node (edit note). Automatically closes menus on click or scroll.
 *
 * @returns An object with menu states, handlers, and utility functions.
 *
 * @example
 * ```tsx
 * const {
 *   paneMenu,
 *   edgeMenu,
 *   nodeMenu,
 *   onPaneContextMenu,
 *   onEdgeContextMenu,
 *   onNodeContextMenu,
 *   closeAllMenus,
 *   updateEdgeType,
 *   updateEdgeEndMarker,
 *   insertNodeAtMenuPosition
 * } = useCanvasContextMenus();
 * ```
 */
export function useCanvasContextMenus(): CanvasContextMenusControls {
  const [paneMenu, setPaneMenu] = useState<PaneMenuState | null>(null);
  const [edgeMenu, setEdgeMenu] = useState<EdgeMenuState | null>(null);
  const [nodeMenu, setNodeMenu] = useState<NodeMenuState | null>(null);
  const updateEdge = useFlowStore((s) => s.updateEdge);

  const closeAllMenus = useCallback((): void => {
    setPaneMenu(null);
    setEdgeMenu(null);
    setNodeMenu(null);
  }, []);

  const onPaneContextMenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, screenToFlowPosition: (coords: { x: number; y: number }) => { x: number; y: number }): void => {
      event.preventDefault();
      const flowPosition = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      setPaneMenu({ x: event.clientX, y: event.clientY, position: flowPosition });
      setEdgeMenu(null);
      setNodeMenu(null);
    },
    [],
  );

  const onEdgeContextMenu: EdgeMouseHandler = useCallback((event, edge) => {
    event.preventDefault();
    event.stopPropagation();
    setPaneMenu(null);
    setNodeMenu(null);
    setEdgeMenu({ x: event.clientX, y: event.clientY, edgeId: edge.id });
  }, []);

  const onNodeContextMenu: NodeMouseHandler<FlowNode> = useCallback((event, node) => {
    if (node.type !== 'note') return;
    event.preventDefault();
    event.stopPropagation();
    setPaneMenu(null);
    setEdgeMenu(null);
    setNodeMenu({
      x: event.clientX,
      y: event.clientY,
      nodeId: node.id,
      nodeType: node.type,
    });
  }, []);

  const updateEdgeTypeHandler = useCallback(
    (edgeId: string, type: EdgeType) => {
      updateEdge(edgeId, { type });
      setEdgeMenu(null);
    },
    [updateEdge],
  );

  const updateEdgeEndMarkerHandler = useCallback(
    (edgeId: string, marker: 'arrow' | 'none') => {
      const markerEnd = marker === 'arrow' ? ({ type: 'arrowclosed' as MarkerType }) : undefined;
      updateEdge(edgeId, { markerEnd });
      setEdgeMenu(null);
    },
    [updateEdge],
  );

  const insertNodeAtMenuPositionHandler = useCallback(
    (type: FlowNode['type'], addNode: (node: FlowNode) => void, createNode: (type: FlowNode['type'], position: { x: number; y: number }) => FlowNode): void => {
      if (!paneMenu) return;
      const node = createNode(type, paneMenu.position);
      addNode(node);
      setPaneMenu(null);
    },
    [paneMenu],
  );

  useEffect(() => {
    if (!paneMenu && !edgeMenu && !nodeMenu) return;
    window.addEventListener('click', closeAllMenus);
    window.addEventListener('scroll', closeAllMenus, true);
    return () => {
      window.removeEventListener('click', closeAllMenus);
      window.removeEventListener('scroll', closeAllMenus, true);
    };
  }, [paneMenu, edgeMenu, nodeMenu, closeAllMenus]);

  return {
    paneMenu,
    edgeMenu,
    nodeMenu,
    onPaneContextMenu,
    onEdgeContextMenu,
    onNodeContextMenu,
    closeAllMenus,
    updateEdgeType: updateEdgeTypeHandler,
    updateEdgeEndMarker: updateEdgeEndMarkerHandler,
    insertNodeAtMenuPosition: insertNodeAtMenuPositionHandler,
  };
}
