/**
 * @module lib/factories/nodeFactory
 * @description Factory functions for creating typed node instances with defaults.
 * Centralizes node creation to enforce consistent IDs, positions, and default data.
 *
 * @owner Team Beta (State & Logic)
 * @dependencies types/nodes
 */

import { nanoid } from 'nanoid';
import type {
  NodeType,
  NodeDataMap,
  FlowNode,
} from '@/types';

/**
 * Generates a unique node ID prefixed with `n_`.
 * @returns A unique string identifier for a node.
 */
export function createNodeId(): string {
  return `n_${nanoid(8)}`;
}

/** Default data payloads keyed by node type. */
const NODE_DEFAULTS: { [K in NodeType]: NodeDataMap[K] } = {
  start: { label: 'Start', variant: 'start', color: '#22c55e', icon: 'play' },
  end: { label: 'End', variant: 'end', color: '#ef4444', icon: 'square' },
  process: { label: 'Process', color: '#3b82f6', icon: 'cog' },
  decision: {
    label: 'Decision',
    color: '#f59e0b',
    icon: 'help-circle',
    branches: { yes: 'Yes', no: 'No' },
  },
  note: { label: 'Note', color: '#94a3b8', icon: 'sticky-note', connectable: false },
  approval: { label: 'Approval', color: '#8b5cf6', icon: 'check-circle' },
  person: { label: 'Person', color: '#06b6d4', icon: 'user' },
  document: { label: 'Document', color: '#f97316', icon: 'file-text' },
  experiment: { label: 'Experiment', color: '#14b8a6', icon: 'flask-conical' },
  hypothesis: { label: 'Hypothesis', color: '#a855f7', icon: 'lightbulb' },
  analysis: { label: 'Analysis', color: '#6366f1', icon: 'bar-chart' },
  entity: { label: 'Entity', color: '#0ea5e9', icon: 'box' },
  relationship: { label: 'Relationship', color: '#64748b', icon: 'link' },
  database: { label: 'Database', color: '#059669', icon: 'database' },
  apiEndpoint: { label: 'API Endpoint', color: '#e11d48', icon: 'globe' },
  requestResponse: { label: 'Request / Response', color: '#d946ef', icon: 'arrow-left-right' },
  authToken: { label: 'Auth Token', color: '#ca8a04', icon: 'key' },
  service: { label: 'Service', color: '#2563eb', icon: 'server' },
  server: { label: 'Server', color: '#475569', icon: 'hard-drive' },
  queue: { label: 'Queue', color: '#0891b2', icon: 'list-ordered' },
  group: { label: 'Group', color: '#78716c', icon: 'group' },
};

/**
 * Returns the default data payload for a given node type.
 * @param type - The node type identifier.
 * @returns A freshly cloned default data object for the requested type.
 */
export function getDefaultNodeData<T extends NodeType>(type: T): NodeDataMap[T] {
  return { ...NODE_DEFAULTS[type] };
}

/**
 * Creates a fully typed {@link FlowNode} with sensible defaults.
 * @param type - The node type to create.
 * @param position - The `{ x, y }` canvas position.
 * @param overrides - Optional partial data merged on top of defaults.
 * @returns A new FlowNode ready to be added to the store.
 */
export function createNode<T extends NodeType>(
  type: T,
  position: { x: number; y: number },
  overrides?: Partial<NodeDataMap[T]>,
): FlowNode {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = { ...getDefaultNodeData(type), ...overrides };
  return {
    id: createNodeId(),
    type,
    position,
    data,
  } as FlowNode;
}
