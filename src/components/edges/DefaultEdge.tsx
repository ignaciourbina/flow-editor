/**
 * @module components/edges/DefaultEdge
 * @description Standard solid-arrow edge for sequential flow.
 * Uses smooth-step path with an arrowhead marker and optional label.
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
// Component
// ---------------------------------------------------------------------------

/**
 * DefaultEdge — the standard edge rendered as a smooth-step path
 * with an `arrowclosed` marker at the target end.
 * If `data.label` is provided, it renders a centered label via
 * the EdgeLabelRenderer portal.
 */
const DefaultEdge: React.FC<TypedEdgeProps<'default'>> = ({
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

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ strokeWidth: 2, ...style }}
        markerEnd={markerEnd ?? 'url(#arrowclosed)'}
      />

      {data?.label && (
        <EdgeLabelRenderer>
          <div
            className="
              absolute bg-white border border-gray-300 rounded px-1.5 py-0.5
              text-label text-gray-700 shadow-sm pointer-events-auto
              nodrag nopan
            "
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default DefaultEdge;
