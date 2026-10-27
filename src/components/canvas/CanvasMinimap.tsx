/**
 * @module components/canvas/CanvasMinimap
 * @description Minimap overlay for navigating large diagrams.
 * Colour-codes nodes by type for quick visual orientation.
 *
 * @owner Team Gamma (UI Components)
 * @dependencies @xyflow/react, types/nodes
 */

import { useCallback } from 'react';
import { MiniMap } from '@xyflow/react';
import type { FlowNode } from '@/types';
import { NODE_COLORS } from '@/lib/constants/design-tokens';

// ---------------------------------------------------------------------------
// Colour map
// ---------------------------------------------------------------------------

/** Maps node types to minimap dot colours. */
const NODE_COLOR_MAP: Record<string, string> = {
  start: NODE_COLORS.start,
  end: NODE_COLORS.end,
  process: NODE_COLORS.process,
  decision: NODE_COLORS.decision,
  note: NODE_COLORS.note,
  data: NODE_COLORS.data,
  api: NODE_COLORS.api,
  // Extended node types (not yet in design tokens)
  approval: '#a855f7',    // purple-500
  person: '#06b6d4',      // cyan-500
  document: '#f97316',    // orange-500
  experiment: '#14b8a6',  // teal-500
  hypothesis: '#8b5cf6',  // violet-500
  analysis: '#ec4899',    // pink-500
  entity: '#0ea5e9',      // sky-500
  relationship: '#64748b',// slate-500
  database: '#10b981',    // emerald-500
  apiEndpoint: '#eab308', // yellow-500
  requestResponse: '#d946ef', // fuchsia-500
  authToken: '#f43f5e',   // rose-500
  service: '#2563eb',     // blue-600
  server: '#1d4ed8',      // blue-700
  queue: '#7c3aed',       // violet-600
  group: '#9ca3af',       // gray-400
};

/** Default colour when node type is unknown. */
const DEFAULT_COLOR = NODE_COLORS.note; // slate-400

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Minimap panel positioned bottom-right. Hidden on narrow screens, where it
 * would cover a large share of the canvas.
 *
 * Uses a `nodeColor` callback to paint each node according to its type,
 * making it easy to distinguish node categories at a glance.
 */
export function CanvasMinimap(): React.JSX.Element {
  const nodeColor = useCallback((node: FlowNode): string => {
    return NODE_COLOR_MAP[node.type ?? ''] ?? DEFAULT_COLOR;
  }, []);

  return (
    <MiniMap
      position="bottom-right"
      nodeColor={nodeColor}
      maskColor="rgba(0, 0, 0, 0.08)"
      className="!hidden md:!block !shadow-md !rounded-lg !border !border-gray-200 dark:!border-gray-700"
      pannable
      zoomable
    />
  );
}

export default CanvasMinimap;
