/**
 * @module components/canvas/CanvasControls
 * @description Zoom in/out, fit view, and lock controls overlay.
 * Positioned bottom-left with Tailwind-based styling overrides.
 *
 * @owner Team Gamma (UI Components)
 * @dependencies @xyflow/react
 */

import { Controls } from '@xyflow/react';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Canvas controls panel (zoom in / out, fit-view, lock).
 *
 * Wraps React Flow's `<Controls />` with custom positioning and styling
 * via Tailwind utility classes applied through the `className` prop.
 */
export function CanvasControls(): React.JSX.Element {
  return (
    <Controls
      position="bottom-left"
      showZoom
      showFitView
      showInteractive
      className="!shadow-md !rounded-lg !border !border-gray-200 !bg-white/90 dark:!bg-gray-800/90 dark:!border-gray-700"
    />
  );
}

export default CanvasControls;
