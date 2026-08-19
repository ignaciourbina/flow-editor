/**
 * @module components/nodes/StartEndNode
 * @description Start and End terminal nodes — pill/stadium shape.
 * Start variant: green bg, Play icon, source handle only (bottom).
 * End variant: red bg, Square icon, target handle only (top).
 *
 * @owner Team Gamma (UI Components)
 * @dependencies components/nodes/BaseNode, types/nodes
 */

import React from 'react';
import { Position } from '@xyflow/react';
import { Play, Square } from 'lucide-react';
import { useNodeHandleReposition } from '@/hooks';
import { BaseNode } from './BaseNode';
import type { TypedNodeProps } from './types';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * StartEndNode — terminal node with pill/stadium shape.
 * Renders either a green "Start" or red "End" variant based on `data.variant`.
 */
const StartEndNode: React.FC<TypedNodeProps<'start' | 'end'>> = ({ id, data, selected, sourcePosition, targetPosition }) => {
  const isStart = data.variant === 'start';
  const { handleReposition } = useNodeHandleReposition(id);

  const icon = isStart ? (
    <Play size={14} className="text-white" />
  ) : (
    <Square size={14} className="text-white" />
  );

  const color = isStart ? 'bg-green-500 text-white' : 'bg-red-500 text-white';

  return (
    <BaseNode
      label={data.label}
      icon={icon}
      color={color}
      selected={selected}
      className="rounded-full"
      sourceHandles={isStart ? [{ position: sourcePosition ?? Position.Bottom }] : []}
      targetHandles={isStart ? [] : [{ position: targetPosition ?? Position.Top }]}
      repositionable
      onReposition={handleReposition}
    />
  );
};

export default StartEndNode;
