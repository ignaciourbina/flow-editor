/**
 * @module components/edges/ConditionalEdge
 * @description Labeled conditional edge for decision branches (Yes/No).
 * Renders a color-coded badge: green for "yes", red for "no",
 * neutral gray for other values.
 *
 * @owner Team Gamma (UI Components)
 * @dependencies types/edges
 */

import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
} from '@xyflow/react';
import type { TypedEdgeProps } from '../nodes/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns Tailwind classes for the condition badge based on condition value. */
function getBadgeClasses(condition: string): string {
  const lower = condition.toLowerCase();
  if (lower === 'yes') return 'bg-green-100 text-green-700 border-green-300';
  if (lower === 'no') return 'bg-red-100 text-red-700 border-red-300';
  return 'bg-gray-100 text-gray-700 border-gray-300';
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * ConditionalEdge — renders a smooth-step path identical to DefaultEdge
 * but with a color-coded condition badge instead of a plain label.
 */
const ConditionalEdge: React.FC<TypedEdgeProps<'conditional'>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  data,
  markerEnd,
}) => {
  const label = data?.label ?? data?.condition ?? '';

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const badgeClasses = getBadgeClasses(data?.condition ?? label);

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ strokeWidth: 2, ...style }}
        markerEnd={markerEnd ?? 'url(#arrowclosed)'}
      />

      {label && (
        <EdgeLabelRenderer>
          <div
            className={`
              absolute border rounded-full px-2 py-0.5
              text-label font-semibold shadow-sm
              pointer-events-auto nodrag nopan
              ${badgeClasses}
            `}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default ConditionalEdge;
