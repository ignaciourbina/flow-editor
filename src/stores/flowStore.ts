/**
 * @module stores/flowStore
 * @description Zustand store for flow state: nodes, edges, selection, and undo/redo history.
 * Central store for the diagram canvas — all canvas interactions read/write here.
 *
 * @owner Team Beta (State & Logic)
 * @dependencies types/nodes, types/edges, @xyflow/react
 */

import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge as rfAddEdge,
} from '@xyflow/react';
import type { NodeChange, EdgeChange, Connection } from '@xyflow/react';
import type { FlowNode, BaseNodeData } from '@/types';
import type { FlowEdge } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Snapshot of nodes and edges for undo/redo history. */
export interface FlowSnapshot {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

/** Maximum number of undo/redo history entries. */
const MAX_HISTORY = 30;

/** Full shape of the flow store (state + actions). */
export interface FlowStoreState {
  // --- State ---
  nodes: FlowNode[];
  edges: FlowEdge[];
  selectedNodeIds: string[];
  selectedEdgeIds: string[];
  past: FlowSnapshot[];
  future: FlowSnapshot[];

  // --- Computed helpers ---
  /** Whether undo is available. */
  canUndo: () => boolean;
  /** Whether redo is available. */
  canRedo: () => boolean;

  // --- React Flow callbacks ---
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // --- Node actions ---
  addNode: (node: FlowNode) => void;
  removeNode: (id: string) => void;
  updateNodeData: (id: string, data: Partial<BaseNodeData>) => void;
  updateNode: (id: string, updates: Partial<FlowNode>) => void;

  // --- Edge actions ---
  addEdge: (edge: FlowEdge) => void;
  removeEdge: (id: string) => void;
  updateEdge: (id: string, updates: Partial<FlowEdge>) => void;

  // --- Selection ---
  selectNode: (id: string) => void;
  toggleNodeSelection: (id: string) => void;
  setSelection: (nodeIds: string[], edgeIds: string[]) => void;
  clearSelection: () => void;
  selectAll: () => void;

  // --- History ---
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useFlowStore = create<FlowStoreState>()((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeIds: [],
  selectedEdgeIds: [],
  past: [],
  future: [],

  canUndo: (): boolean => get().past.length > 0,
  canRedo: (): boolean => get().future.length > 0,

  // --- React Flow callbacks ---
  onNodesChange: (changes) =>
    set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) as FlowNode[] })),

  onEdgesChange: (changes) =>
    set((s) => ({ edges: applyEdgeChanges(changes, s.edges) as FlowEdge[] })),

  onConnect: (connection) => {
    get().pushHistory();
    set((s) => ({ edges: rfAddEdge(connection, s.edges) as FlowEdge[] }));
  },

  // --- Node actions ---
  addNode: (node) => {
    get().pushHistory();
    set((s) => ({ nodes: [...s.nodes, node] }));
  },

  removeNode: (id) => {
    get().pushHistory();
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeIds: s.selectedNodeIds.filter((nid) => nid !== id),
    }));
  },

  updateNodeData: (id, data) => {
    get().pushHistory();
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n,
      ),
    }));
  },

  updateNode: (id, updates) => {
    get().pushHistory();
    set((s) => ({
      nodes: s.nodes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    }));
  },

  // --- Edge actions ---
  addEdge: (edge) => {
    get().pushHistory();
    set((s) => ({ edges: [...s.edges, edge] }));
  },

  removeEdge: (id) => {
    get().pushHistory();
    set((s) => ({
      edges: s.edges.filter((e) => e.id !== id),
      selectedEdgeIds: s.selectedEdgeIds.filter((eid) => eid !== id),
    }));
  },

  updateEdge: (id, updates) => {
    get().pushHistory();
    set((s) => ({
      edges: s.edges.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  },

  // --- Selection ---
  selectNode: (id) => set({ selectedNodeIds: [id], selectedEdgeIds: [] }),

  toggleNodeSelection: (id) =>
    set((s) => ({
      selectedNodeIds: s.selectedNodeIds.includes(id)
        ? s.selectedNodeIds.filter((nid) => nid !== id)
        : [...s.selectedNodeIds, id],
    })),

  setSelection: (nodeIds, edgeIds) =>
    set({
      selectedNodeIds: nodeIds,
      selectedEdgeIds: edgeIds,
    }),

  clearSelection: () => set({ selectedNodeIds: [], selectedEdgeIds: [] }),

  selectAll: () =>
    set((s) => ({
      selectedNodeIds: s.nodes.map((n) => n.id),
      selectedEdgeIds: s.edges.map((e) => e.id),
    })),

  // --- History ---
  pushHistory: () =>
    set((s) => ({
      past: [...s.past, { nodes: s.nodes, edges: s.edges }].slice(-MAX_HISTORY),
      future: [],
    })),

  undo: () =>
    set((s) => {
      const prev = s.past[s.past.length - 1];
      if (!prev) return s;
      return {
        past: s.past.slice(0, -1),
        future: [{ nodes: s.nodes, edges: s.edges }, ...s.future].slice(0, MAX_HISTORY),
        nodes: prev.nodes,
        edges: prev.edges,
      };
    }),

  redo: () =>
    set((s) => {
      const next = s.future[0];
      if (!next) return s;
      return {
        future: s.future.slice(1),
        past: [...s.past, { nodes: s.nodes, edges: s.edges }].slice(-MAX_HISTORY),
        nodes: next.nodes,
        edges: next.edges,
      };
    }),
}));
