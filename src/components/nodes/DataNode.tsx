/**
 * @module components/nodes/DataNode
 * @description Data I/O node — parallelogram shape via CSS skew transform.
 * Used in Data and API domains.
 *
 * @owner Team Gamma (UI Components)
 * @dependencies components/nodes/BaseNode, types/nodes
 */

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Database } from 'lucide-react';
import type { TypedNodeProps } from './types';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * DataNode — parallelogram-shaped node for data I/O steps.
 * Outer wrapper applies `skewX(-12deg)`, inner content counter-skews
 * to keep text horizontal.
 */
const DataNode: React.FC<TypedNodeProps<'database'>> = ({ data, selected }) => {
  const ringClass = selected ? 'ring-2 ring-blue-500' : '';

  return (
    <div className="relative">
      <div
        className={`
          skew-x-[-12deg] rounded border border-purple-300 bg-purple-100
          shadow-sm min-w-[120px] ${ringClass}
        `}
      >
        <div className="skew-x-[12deg] flex items-center gap-1.5 px-4 py-2">
          <Database size={14} className="text-purple-600 flex-shrink-0" />
          <span className="text-xs font-medium text-purple-800 truncate">
            {data.label}
          </span>
        </div>
        {data.description && (
          <div className="skew-x-[12deg] px-4 pb-2">
            <p className="text-label text-purple-500 leading-tight">{data.description}</p>
          </div>
        )}
      </div>

      {/* Target handle — top */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-gray-400 !border-2 !border-white"
      />

      {/* Source handle — bottom */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-gray-600 !border-2 !border-white"
      />
    </div>
  );
};

export default DataNode;
