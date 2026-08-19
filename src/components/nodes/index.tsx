/**
 * @module components/nodes/index
 * @description Extensible node type registry with metadata for palette display.
 * React Flow uses the derived nodeTypes map to resolve custom node types.
 *
 * @owner Team Gamma (UI Components)
 */

import type { NodeTypes } from '@xyflow/react';
import type { NodeType, NodeDataMap } from '@/types';
import React from 'react';
import {
  Play,
  Square,
  Cog,
  GitBranch,
  StickyNote,
  Database,
  Globe,
} from 'lucide-react';
import StartEndNode from './StartEndNode';
import ProcessNode from './ProcessNode';
import DecisionNode from './DecisionNode';
import NoteNode from './NoteNode';
import DataNode from './DataNode';
import ApiNode from './ApiNode';
import { NODE_COLORS } from '@/lib/constants/design-tokens';

// Re-export individual components for direct import
export { default as BaseNode } from './BaseNode';
export type { BaseNodeProps } from './BaseNode';
export { default as StartEndNode } from './StartEndNode';
export { default as ProcessNode } from './ProcessNode';
export { default as DecisionNode } from './DecisionNode';
export { default as NoteNode } from './NoteNode';
export { default as DataNode } from './DataNode';
export { default as ApiNode } from './ApiNode';
export type { TypedNodeProps, TypedEdgeProps } from './types';

/**
 * Registry entry for a node type with component, default data, and palette metadata.
 * @template T - The node type identifier (e.g., 'process', 'decision').
 */
export interface NodeRegistryEntry<T extends NodeType = NodeType> {
  /** Node type identifier. */
  type: T;
  /** React component to render this node type. */
  component: React.ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  /** Default data payload for new nodes of this type. */
  defaultData: NodeDataMap[T];
  /** Palette category ID (e.g., 'terminals', 'process', 'logic'). */
  category: string;
  /** Display label in the palette. */
  label: string;
  /** Icon element for the palette. */
  icon: React.ReactNode;
  /** Color for visual identification. */
  color: string;
}

/**
 * Extensible node registry. Add a new entry here to register a node type.
 *
 * Each entry defines:
 * - The component to render
 * - Default data for new instances
 * - Palette metadata (category, label, icon, color)
 *
 * Adding a new node type:
 * 1. Add type to NodeType union in types/nodes.ts
 * 2. Add data interface to NodeDataMap in types/nodes.ts
 * 3. Create component file in components/nodes/
 * 4. Add entry to this registry
 *
 * @see types/nodes.ts for checklist on adding node types
 */
export const NODE_REGISTRY = [
  // Core nodes
  {
    type: 'start',
    component: StartEndNode,
    defaultData: { label: 'Start', variant: 'start' as const, color: NODE_COLORS.start, icon: 'play' },
    category: 'terminals',
    label: 'Start',
    icon: <Play size={14} />,
    color: NODE_COLORS.start,
  },
  {
    type: 'end',
    component: StartEndNode,
    defaultData: { label: 'End', variant: 'end' as const, color: NODE_COLORS.end, icon: 'square' },
    category: 'terminals',
    label: 'End',
    icon: <Square size={14} />,
    color: NODE_COLORS.end,
  },
  {
    type: 'process',
    component: ProcessNode,
    defaultData: { label: 'Process', color: NODE_COLORS.process, icon: 'cog' },
    category: 'process',
    label: 'Process',
    icon: <Cog size={14} />,
    color: NODE_COLORS.process,
  },
  {
    type: 'decision',
    component: DecisionNode,
    defaultData: {
      label: 'Decision',
      color: NODE_COLORS.decision,
      icon: 'help-circle',
      branches: { yes: 'Yes', no: 'No' },
    },
    category: 'logic',
    label: 'Decision',
    icon: <GitBranch size={14} />,
    color: NODE_COLORS.decision,
  },
  {
    type: 'note',
    component: NoteNode,
    defaultData: { label: 'Note', color: NODE_COLORS.note, icon: 'sticky-note', connectable: false },
    category: 'annotation',
    label: 'Note',
    icon: <StickyNote size={14} />,
    color: NODE_COLORS.note,
  },
  // Domain nodes with dedicated components
  {
    type: 'database',
    component: DataNode,
    defaultData: { label: 'Database', color: '#059669', icon: 'database' },
    category: 'data',
    label: 'Database',
    icon: <Database size={14} />,
    color: '#059669',
  },
  {
    type: 'apiEndpoint',
    component: ApiNode,
    defaultData: { label: 'API Endpoint', color: '#e11d48', icon: 'globe' },
    category: 'integration',
    label: 'API',
    icon: <Globe size={14} />,
    color: '#e11d48',
  },
  // Domain nodes using ProcessNode for now
  {
    type: 'approval',
    component: ProcessNode,
    defaultData: { label: 'Approval', color: '#8b5cf6', icon: 'check-circle' },
    category: 'process',
    label: 'Approval',
    icon: <Cog size={14} />,
    color: '#8b5cf6',
  },
  {
    type: 'person',
    component: ProcessNode,
    defaultData: { label: 'Person', color: '#06b6d4', icon: 'user' },
    category: 'process',
    label: 'Person',
    icon: <Cog size={14} />,
    color: '#06b6d4',
  },
  {
    type: 'document',
    component: ProcessNode,
    defaultData: { label: 'Document', color: '#f97316', icon: 'file-text' },
    category: 'data',
    label: 'Document',
    icon: <Cog size={14} />,
    color: '#f97316',
  },
  {
    type: 'experiment',
    component: ProcessNode,
    defaultData: { label: 'Experiment', color: '#14b8a6', icon: 'flask-conical' },
    category: 'process',
    label: 'Experiment',
    icon: <Cog size={14} />,
    color: '#14b8a6',
  },
  {
    type: 'hypothesis',
    component: ProcessNode,
    defaultData: { label: 'Hypothesis', color: '#a855f7', icon: 'lightbulb' },
    category: 'process',
    label: 'Hypothesis',
    icon: <Cog size={14} />,
    color: '#a855f7',
  },
  {
    type: 'analysis',
    component: ProcessNode,
    defaultData: { label: 'Analysis', color: '#6366f1', icon: 'bar-chart' },
    category: 'process',
    label: 'Analysis',
    icon: <Cog size={14} />,
    color: '#6366f1',
  },
  {
    type: 'entity',
    component: ProcessNode,
    defaultData: { label: 'Entity', color: '#0ea5e9', icon: 'box' },
    category: 'data',
    label: 'Entity',
    icon: <Cog size={14} />,
    color: '#0ea5e9',
  },
  {
    type: 'relationship',
    component: ProcessNode,
    defaultData: { label: 'Relationship', color: '#64748b', icon: 'link' },
    category: 'data',
    label: 'Relationship',
    icon: <Cog size={14} />,
    color: '#64748b',
  },
  {
    type: 'requestResponse',
    component: ProcessNode,
    defaultData: { label: 'Request / Response', color: '#d946ef', icon: 'arrow-left-right' },
    category: 'integration',
    label: 'Req/Resp',
    icon: <Cog size={14} />,
    color: '#d946ef',
  },
  {
    type: 'authToken',
    component: ProcessNode,
    defaultData: { label: 'Auth Token', color: '#ca8a04', icon: 'key' },
    category: 'integration',
    label: 'Auth',
    icon: <Cog size={14} />,
    color: '#ca8a04',
  },
  {
    type: 'service',
    component: ProcessNode,
    defaultData: { label: 'Service', color: '#2563eb', icon: 'server' },
    category: 'integration',
    label: 'Service',
    icon: <Cog size={14} />,
    color: '#2563eb',
  },
  {
    type: 'server',
    component: ProcessNode,
    defaultData: { label: 'Server', color: '#475569', icon: 'hard-drive' },
    category: 'integration',
    label: 'Server',
    icon: <Cog size={14} />,
    color: '#475569',
  },
  {
    type: 'queue',
    component: ProcessNode,
    defaultData: { label: 'Queue', color: '#0891b2', icon: 'list-ordered' },
    category: 'integration',
    label: 'Queue',
    icon: <Cog size={14} />,
    color: '#0891b2',
  },
  {
    type: 'group',
    component: ProcessNode,
    defaultData: { label: 'Group', color: '#78716c', icon: 'group' },
    category: 'process',
    label: 'Group',
    icon: <Cog size={14} />,
    color: '#78716c',
  },
] as const satisfies readonly NodeRegistryEntry[];

/**
 * Node type registry consumed by `<ReactFlow nodeTypes={nodeTypes} />`.
 * Derived from NODE_REGISTRY to avoid manual maintenance.
 *
 * NOTE: The registry requires a type assertion because React Flow's NodeTypes
 * expects untyped components (NodeProps), but our components use TypedNodeProps.
 * This is the ONLY location where an 'as' cast is used — all component files
 * are now type-safe without casts.
 */
export const nodeTypes: NodeTypes = NODE_REGISTRY.reduce(
  (acc, entry) => {
    acc[entry.type] = entry.component;
    return acc;
  },
  {} as Record<string, React.ComponentType<any>>, // eslint-disable-line @typescript-eslint/no-explicit-any
) as NodeTypes;
