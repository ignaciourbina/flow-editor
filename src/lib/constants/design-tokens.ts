/**
 * @module lib/constants/design-tokens
 * @description Single-source-of-truth for all design tokens: node colors, canvas backgrounds, and grid colors.
 * These values are synchronized with CSS custom properties in globals.css.
 *
 * @owner Team Alpha (Foundation)
 * @dependencies None
 */

// ---------------------------------------------------------------------------
// Node colors
// ---------------------------------------------------------------------------

/**
 * Color palette for all node types in the flow editor.
 * Keys correspond to {@link NodeType} discriminators from types/nodes.ts.
 * Values are hex color codes matching CSS variables in globals.css (--node-*).
 *
 * @example
 * ```ts
 * import { NODE_COLORS } from '@/lib/constants/design-tokens';
 * const startNodeColor = NODE_COLORS.start; // '#22c55e'
 * ```
 */
export const NODE_COLORS = {
  start: '#22c55e',
  end: '#ef4444',
  process: '#3b82f6',
  decision: '#f59e0b',
  data: '#8b5cf6',
  note: '#94a3b8',
  api: '#06b6d4',
} as const;

// ---------------------------------------------------------------------------
// Canvas backgrounds
// ---------------------------------------------------------------------------

/**
 * Background color options for the canvas.
 * Keys correspond to theme variants (beige, grey, black).
 * Values are hex color codes for the main background fill.
 *
 * @example
 * ```ts
 * import { CANVAS_BACKGROUNDS } from '@/lib/constants/design-tokens';
 * const beigeBackground = CANVAS_BACKGROUNDS.beige; // '#f5f0e6'
 * ```
 */
export const CANVAS_BACKGROUNDS = {
  beige: '#f5f0e6',
  grey: '#f8fafc',
  black: '#111827',
} as const;

/**
 * Grid color options for the canvas dot pattern.
 * Keys correspond to theme variants (beige, grey, black).
 * Values are hex color codes for the grid dots/lines.
 *
 * @example
 * ```ts
 * import { CANVAS_GRIDS } from '@/lib/constants/design-tokens';
 * const beigeGrid = CANVAS_GRIDS.beige; // '#d6c8b3'
 * ```
 */
export const CANVAS_GRIDS = {
  beige: '#d6c8b3',
  grey: '#e2e8f0',
  black: '#374151',
} as const;
