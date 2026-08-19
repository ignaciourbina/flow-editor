/**
 * @module types/nodes
 * @description Core type definitions for all node types in the flow editor.
 * This is a foundational module — all node components and stores depend on these types.
 *
 * ## How to Add a New Node Type
 *
 * To add a new node type to the flow editor, follow these steps:
 *
 * 1. **Add type identifier**: Add the new type to `CoreNodeType` or `DomainNodeType` below.
 * 2. **Add data interface**: Extend `BaseNodeData` with a new interface for the node's data.
 * 3. **Update NodeDataMap**: Add the new type → data mapping to `NodeDataMap`.
 * 4. **Create component**: Create a new component in `src/components/nodes/` (or reuse existing).
 * 5. **Register node**: Add entry to `NODE_REGISTRY` in `src/components/nodes/index.ts` with:
 *    - Component reference
 *    - Default data payload
 *    - Palette metadata (category, label, icon, color)
 *
 * The node will automatically appear in:
 * - React Flow's nodeTypes registry (for rendering)
 * - Node palette (for drag-and-drop creation)
 * - Type system (for type-safe data access)
 *
 * @owner Team Alpha (Foundation)
 * @dependencies None (leaf module)
 */

import type { Node } from '@xyflow/react';

// ---------------------------------------------------------------------------
// Node type identifiers
// ---------------------------------------------------------------------------

/** Core node types available in every domain. */
export type CoreNodeType = 'start' | 'end' | 'process' | 'decision' | 'note';

/** Domain-specific node types added in Phase 3. */
export type DomainNodeType =
  | 'approval'
  | 'person'
  | 'document'
  | 'experiment'
  | 'hypothesis'
  | 'analysis'
  | 'entity'
  | 'relationship'
  | 'database'
  | 'apiEndpoint'
  | 'requestResponse'
  | 'authToken'
  | 'service'
  | 'server'
  | 'queue'
  | 'group';

/** Union of all available node type identifiers. */
export type NodeType = CoreNodeType | DomainNodeType;

// ---------------------------------------------------------------------------
// Node data interfaces
// ---------------------------------------------------------------------------

/**
 * Base data payload attached to every node.
 * Domain-specific nodes extend this interface with additional fields.
 */
export interface BaseNodeData {
  /** Index signature required by @xyflow/react Node<T> constraint. */
  [key: string]: unknown;
  /** Display label shown inside the node. */
  label: string;
  /** Optional longer description shown in tooltip or property panel. */
  description?: string;
  /** Hex color override for the node background. */
  color?: string;
  /** Lucide icon name to render inside the node. */
  icon?: string;
  /** Freeform metadata bag for domain-specific data. */
  metadata?: Record<string, unknown>;
}

/** Data specific to Start/End terminal nodes. */
export interface StartEndNodeData extends BaseNodeData {
  /** Whether this is a 'start' or 'end' terminal. */
  variant: 'start' | 'end';
}

/** Data specific to Decision/Gateway nodes. */
export interface DecisionNodeData extends BaseNodeData {
  /** Labels for the outgoing branches (default: Yes/No). */
  branches?: { yes: string; no: string };
}

/** Data specific to Note/Annotation nodes. */
export interface NoteNodeData extends BaseNodeData {
  /** Extended text body for the annotation. */
  body?: string;
  /** Whether the note can be connected to other nodes. */
  connectable?: boolean;
}

/** Data specific to API Endpoint nodes (Phase 3). */
export interface ApiNodeData extends BaseNodeData {
  /** HTTP method (GET, POST, PUT, DELETE, PATCH). */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** URL path for the endpoint. */
  path?: string;
}

/** Data specific to Database nodes (Phase 3). */
export interface DatabaseNodeData extends BaseNodeData {
  /** Database engine label (e.g., PostgreSQL, MongoDB). */
  engine?: string;
}

/** Data specific to Entity nodes for ER diagrams (Phase 3). */
export interface EntityNodeData extends BaseNodeData {
  /** List of field names in the entity. */
  fields?: Array<{ name: string; type: string; isPrimaryKey?: boolean }>;
}

// ---------------------------------------------------------------------------
// Node data type map
// ---------------------------------------------------------------------------

/**
 * Maps each NodeType to its corresponding data interface.
 * Used by the generic FlowNode type to ensure type-safe data access.
 */
export interface NodeDataMap {
  start: StartEndNodeData;
  end: StartEndNodeData;
  process: BaseNodeData;
  decision: DecisionNodeData;
  note: NoteNodeData;
  approval: BaseNodeData;
  person: BaseNodeData;
  document: BaseNodeData;
  experiment: BaseNodeData;
  hypothesis: BaseNodeData;
  analysis: BaseNodeData;
  entity: EntityNodeData;
  relationship: BaseNodeData;
  database: DatabaseNodeData;
  apiEndpoint: ApiNodeData;
  requestResponse: BaseNodeData;
  authToken: BaseNodeData;
  service: BaseNodeData;
  server: BaseNodeData;
  queue: BaseNodeData;
  group: BaseNodeData;
}

// ---------------------------------------------------------------------------
// FlowNode — the primary node type used throughout the app
// ---------------------------------------------------------------------------

/**
 * Strongly-typed flow node extending React Flow's Node type.
 * The generic parameter `T` narrows the `data` field to the correct interface.
 *
 * @example
 * const startNode: FlowNode<'start'> = {
 *   id: 'n1',
 *   type: 'start',
 *   position: { x: 0, y: 0 },
 *   data: { label: 'Begin', variant: 'start' },
 * };
 */
export type FlowNode<T extends NodeType = NodeType> = Node<NodeDataMap[T], T>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Array of all core node type identifiers (used for palette filtering). */
export const CORE_NODE_TYPES: readonly CoreNodeType[] = [
  'start',
  'end',
  'process',
  'decision',
  'note',
] as const;

/** Array of all domain node type identifiers. */
export const DOMAIN_NODE_TYPES: readonly DomainNodeType[] = [
  'approval',
  'person',
  'document',
  'experiment',
  'hypothesis',
  'analysis',
  'entity',
  'relationship',
  'database',
  'apiEndpoint',
  'requestResponse',
  'authToken',
  'service',
  'server',
  'queue',
  'group',
] as const;

/** Type guard: checks if a string is a valid NodeType. */
export function isNodeType(value: string): value is NodeType {
  return (
    (CORE_NODE_TYPES as readonly string[]).includes(value) ||
    (DOMAIN_NODE_TYPES as readonly string[]).includes(value)
  );
}
