/**
 * @module components/nodes/ProcessNode
 * @description Task/Process node — rounded rectangle with 4 handles.
 * Used across Admin, Research, and System domains.
 *
 * @owner Team Gamma (UI Components)
 * @dependencies components/nodes/BaseNode, types/nodes
 */

import React from 'react';
import { Position } from '@xyflow/react';
import { Cog } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { TypedNodeProps } from './types';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * ProcessNode — standard task/process step with a rounded rectangle shape.
 * Provides four connection handles: top (target), bottom (source),
 * left (target), and right (source).
 */
const ProcessNode: React.FC<TypedNodeProps<'process'>> = ({ data, selected }) => {

  return (
    <BaseNode
      label={data.label}
      icon={<Cog size={14} className="text-white" />}
      color="bg-blue-500 text-white"
      selected={selected}
      targetHandles={[
        { position: Position.Top },
        { position: Position.Left, id: 'left-target' },
      ]}
      sourceHandles={[
        { position: Position.Bottom },
        { position: Position.Right, id: 'right-source' },
      ]}
    >
      {data.description && (
        <p className="text-gray-500 text-label leading-tight">{data.description}</p>
      )}
    </BaseNode>
  );
};

export default ProcessNode;
