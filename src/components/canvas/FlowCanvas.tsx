/**
 * @module components/canvas/FlowCanvas
 * @description Main canvas component wrapping ReactFlow with custom nodes, edges, and controls.
 * Serves as the centrepiece of the flow editor — renders the interactive diagram.
 *
 * @owner Team Gamma (UI Components)
 * @dependencies @xyflow/react, components/nodes, components/edges, stores/flowStore, lib/factories
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useFlowStore } from '@/stores/flowStore';
import { useUiStore } from '@/stores/uiStore';
import { useProjectStore } from '@/stores/projectStore';
import { nodeTypes } from '@/components/nodes';
import { edgeTypes } from '@/components/edges';
import { createNode } from '@/lib/factories';
import { EDGE_TYPES, isNodeType } from '@/types';
import type { FlowNode, NoteNodeData } from '@/types';
import { CANVAS_BACKGROUNDS, CANVAS_GRIDS } from '@/lib/constants/design-tokens';
import { ADD_NODE_EVENT } from '@/lib/constants/canvas';
import { useCanvasContextMenus } from '@/hooks';

import { CanvasBackground } from './CanvasBackground';
import { CanvasControls } from './CanvasControls';
import { CanvasMinimap } from './CanvasMinimap';
import { NoteEditorModal } from './NoteEditorModal';

/**
 * Inner canvas that lives inside `ReactFlowProvider` so it can access
 * `useReactFlow()` for coordinate conversion during drag-and-drop.
 */
function FlowCanvasInner(): React.JSX.Element {
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const onNodesChange: OnNodesChange<FlowNode> = useFlowStore((s) => s.onNodesChange);
  const onEdgesChange: OnEdgesChange = useFlowStore((s) => s.onEdgesChange);
  const onConnect: OnConnect = useFlowStore((s) => s.onConnect);
  const addNode = useFlowStore((s) => s.addNode);
  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const showCanvasGrid = useUiStore((s) => s.showCanvasGrid);
  const canvasGridStyle = useUiStore((s) => s.canvasGridStyle);
  const canvasBackgroundColor = useUiStore((s) => s.canvasBackgroundColor);

  const projectSettings = useProjectStore((s) => s.project?.settings);
  const snapToGrid = projectSettings?.snapToGrid ?? true;
  const gridSize = projectSettings?.gridSize ?? 15;
  const showMinimap = projectSettings?.showMinimap ?? true;

  const { screenToFlowPosition } = useReactFlow();
  const {
    paneMenu,
    edgeMenu,
    nodeMenu,
    onPaneContextMenu,
    onEdgeContextMenu,
    onNodeContextMenu,
    updateEdgeType,
    updateEdgeEndMarker,
    insertNodeAtMenuPosition,
  } = useCanvasContextMenus();

  const [noteEditorState, setNoteEditorState] = useState<{
    nodeId: string;
    label: string;
    body: string;
  } | null>(null);

  const QUICK_NODE_TYPES: Array<{ type: FlowNode['type']; label: string }> = [
    { type: 'start', label: 'Start' },
    { type: 'process', label: 'Process' },
    { type: 'decision', label: 'Decision' },
    { type: 'note', label: 'Note' },
    { type: 'end', label: 'End' },
  ];

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>): void => {
      event.preventDefault();

      const rawType =
        event.dataTransfer.getData('application/flow-editor-node') ||
        event.dataTransfer.getData('application/reactflow');
      if (!rawType || !isNodeType(rawType)) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const node = createNode(rawType, position);
      addNode(node);
    },
    [screenToFlowPosition, addNode],
  );

  // Palette clicks and taps add the node at the centre of the visible canvas.
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleAddNode = (event: Event): void => {
      const rawType = (event as CustomEvent<string>).detail;
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect || !isNodeType(rawType)) return;

      const position = screenToFlowPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
      addNode(createNode(rawType, position));
    };
    window.addEventListener(ADD_NODE_EVENT, handleAddNode);
    return () => window.removeEventListener(ADD_NODE_EVENT, handleAddNode);
  }, [screenToFlowPosition, addNode]);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement>): void => {
      onPaneContextMenu(event, screenToFlowPosition);
    },
    [onPaneContextMenu, screenToFlowPosition],
  );

  const openNoteEditor = useCallback(
    (nodeId: string) => {
      const node = useFlowStore.getState().nodes.find((candidate) => candidate.id === nodeId);
      if (!node || node.type !== 'note') return;
      const data = node.data as NoteNodeData;
      setNoteEditorState({
        nodeId,
        label: data.label ?? 'Note',
        body: data.body ?? '',
      });
    },
    [],
  );

  const saveNoteEditor = useCallback(
    (nodeId: string, label: string, body: string) => {
      updateNodeData(nodeId, { label, body });
      setNoteEditorState(null);
    },
    [updateNodeData],
  );

  return (
    <div
      ref={wrapperRef}
      className="h-full w-full"
      style={{ backgroundColor: CANVAS_BACKGROUNDS[canvasBackgroundColor] }}
      onContextMenu={handleContextMenu}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onEdgeContextMenu={onEdgeContextMenu}
        onNodeContextMenu={onNodeContextMenu}
        fitView
        snapToGrid={snapToGrid}
        snapGrid={[gridSize, gridSize]}
        deleteKeyCode="Delete"
        proOptions={{ hideAttribution: true }}
      >
        {showCanvasGrid && (
          <CanvasBackground
            variant={canvasGridStyle}
            color={CANVAS_GRIDS[canvasBackgroundColor]}
            gap={gridSize}
            size={1}
          />
        )}
        <CanvasControls />
        {showMinimap && <CanvasMinimap />}
      </ReactFlow>
      {paneMenu && (
        <div
          className="context-menu min-w-40"
          style={{ left: paneMenu.x, top: paneMenu.y }}
          role="menu"
          aria-label="Add node menu"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
            Add node here
          </div>
          <div className="p-1">
            {QUICK_NODE_TYPES.map((item) => (
              <button
                key={item.type}
                type="button"
                role="menuitem"
                onClick={() => insertNodeAtMenuPosition(item.type, addNode, createNode)}
                className="context-menu-item"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {edgeMenu && (
        <div
          className="context-menu min-w-52"
          style={{ left: edgeMenu.x, top: edgeMenu.y }}
          role="menu"
          aria-label="Edit edge menu"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
            Edit edge
          </div>
          <div className="px-2 py-2">
            <div className="mb-1 text-xs font-semibold text-gray-500 dark:text-gray-300">Type</div>
            <div className="mb-2 flex flex-wrap gap-1">
              {EDGE_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  role="menuitem"
                  onClick={() => updateEdgeType(edgeMenu.edgeId, type)}
                  className="context-menu-option"
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="mb-1 text-xs font-semibold text-gray-500 dark:text-gray-300">End marker</div>
            <div className="flex gap-1">
              <button
                type="button"
                role="menuitem"
                onClick={() => updateEdgeEndMarker(edgeMenu.edgeId, 'arrow')}
                className="context-menu-option"
              >
                Arrow
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => updateEdgeEndMarker(edgeMenu.edgeId, 'none')}
                className="context-menu-option"
              >
                None
              </button>
            </div>
          </div>
        </div>
      )}
      {nodeMenu && (
        <div
          className="context-menu min-w-44"
          style={{ left: nodeMenu.x, top: nodeMenu.y }}
          role="menu"
          aria-label="Edit node menu"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
            Edit note
          </div>
          <div className="p-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => openNoteEditor(nodeMenu.nodeId)}
              className="context-menu-item text-amber-800 bg-amber-50 border border-amber-300 hover:bg-amber-100"
            >
              Edit note content
            </button>
          </div>
        </div>
      )}

      {noteEditorState && (
        <NoteEditorModal
          nodeId={noteEditorState.nodeId}
          initialLabel={noteEditorState.label}
          initialBody={noteEditorState.body}
          onSave={saveNoteEditor}
          onClose={() => setNoteEditorState(null)}
        />
      )}
    </div>
  );
}

/**
 * Top-level canvas component.
 *
 * Wraps the inner ReactFlow canvas in a `ReactFlowProvider` so that hooks
 * like `useReactFlow()` are available to child components.
 */
export function FlowCanvas(): React.JSX.Element {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner />
    </ReactFlowProvider>
  );
}

export default FlowCanvas;
