/**
 * @module components/nodes/ApiNode
 * @description API Endpoint node — hexagon shape via CSS clip-path.
 * Displays HTTP method badge and optional path. Phase 3 domain-specific node.
 *
 * @owner Team Epsilon (Templates & Domains)
 * @dependencies components/nodes/BaseNode, types/nodes
 */

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Hexagon } from 'lucide-react';
import type { TypedNodeProps } from './types';
import { METHOD_COLORS, HEXAGON_CLIP } from '@/lib/constants';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * ApiNode — hexagonal node representing an API endpoint.
 * Shows the HTTP method as a color-coded badge and the endpoint path below.
 */
const ApiNode: React.FC<TypedNodeProps<'apiEndpoint'>> = ({ data, selected }) => {
  const method = data.method ?? 'GET';
  const badgeColor = METHOD_COLORS[method] ?? 'bg-gray-200 text-gray-800';
  const ringClass = selected ? 'ring-2 ring-blue-500' : '';

  return (
    <div className="relative flex items-center justify-center" style={{ width: 130, height: 110 }}>
      {/* Hexagon background */}
      <div
        className={`absolute inset-0 bg-cyan-100 border-cyan-400 ${ringClass}`}
        style={{ clipPath: HEXAGON_CLIP }}
      />

      {/* Content — centered inside the hexagon */}
      <div className="relative z-10 flex flex-col items-center gap-1 px-2 text-center">
        <Hexagon size={14} className="text-cyan-600" />
        <span className="text-label font-medium text-cyan-900 truncate max-w-[90px]">
          {data.label}
        </span>

        {/* Method badge */}
        <span className={`text-caption font-bold px-1.5 rounded ${badgeColor}`}>
          {method}
        </span>

        {/* Optional path */}
        {data.path && (
          <span className="text-caption text-cyan-700 truncate max-w-[100px]">
            {data.path}
          </span>
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

export default ApiNode;
