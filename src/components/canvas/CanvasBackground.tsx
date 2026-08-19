/**
 * @module components/canvas/CanvasBackground
 * @description Configurable background (dots, lines, cross) for the canvas.
 * Wraps React Flow's `<Background />` with project-level defaults.
 *
 * @owner Team Gamma (UI Components)
 * @dependencies @xyflow/react
 */

import { Background, BackgroundVariant } from '@xyflow/react';
import { VARIANT_MAP } from '@/lib/constants';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

/** Props accepted by {@link CanvasBackground}. */
export interface CanvasBackgroundProps {
  /** Background pattern variant. @default 'dots' */
  variant?: 'dots' | 'lines' | 'cross' | 'dashed';
  /** Gap between pattern elements in px. @default 16 */
  gap?: number;
  /** Size of dots / line width. @default 1 */
  size?: number;
  /** Grid line/dot color. */
  color?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Canvas background layer with configurable pattern.
 *
 * Uses the CSS variable `--canvas-grid` for the pattern color so themes
 * can override it without a re-render.
 */
export function CanvasBackground({
  variant = 'dots',
  gap = 16,
  size = 1,
  color = 'var(--canvas-grid, #e5e7eb)',
}: CanvasBackgroundProps): React.JSX.Element {
  const computedSize = variant === 'dashed' ? Math.max(size, 2) : size;

  return (
    <Background
      variant={VARIANT_MAP[variant] ?? BackgroundVariant.Dots}
      gap={gap}
      size={computedSize}
      color={color}
    />
  );
}

export default CanvasBackground;
