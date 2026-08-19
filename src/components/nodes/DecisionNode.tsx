/**
 * @module components/nodes/DecisionNode
 * @description Decision/Gateway node — diamond shape via CSS rotation.
 * Target handle at top, two source handles: right (yes), bottom (no).
 *
 * @owner Team Gamma (UI Components)
 * @dependencies components/nodes/BaseNode, types/nodes
 */

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { HelpCircle } from 'lucide-react';
import type { TypedNodeProps } from './types';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * DecisionNode — diamond-shaped gateway used for branching logic.
 * Applies `rotate-45` on the outer wrapper and `-rotate-45` on the inner
 * content so text stays horizontal while the card appears as a diamond.
 */
const DecisionNode: React.FC<TypedNodeProps<'decision'>> = ({ data, selected }) => {
  const yesLabel = data.branches?.yes ?? 'Yes';
  const noLabel = data.branches?.no ?? 'No';
  const ringClass = selected ? 'ring-2 ring-blue-500' : '';

  return (
    <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
      {/* Diamond wrapper */}
      <div
        className={`
          w-node-sm h-node-sm rotate-45 border-2 border-amber-400
          bg-amber-100 shadow-sm ${ringClass}
        `}
      >
        {/* Counter-rotated content */}
        <div className="-rotate-45 flex flex-col items-center justify-center w-full h-full">
          <HelpCircle size={16} className="text-amber-600 mb-0.5" />
          <span className="text-label font-medium text-amber-800 text-center leading-tight truncate max-w-[56px]">
            {data.label}
          </span>
        </div>
      </div>

      {/* Target handle — top */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-gray-400 !border-2 !border-white"
      />

      {/* Source handle — right ("yes") */}
      <Handle
        type="source"
        position={Position.Right}
        id="yes"
        className="!w-2.5 !h-2.5 !bg-green-500 !border-2 !border-white"
      />
      <span className="absolute right-[-26px] top-1/2 -translate-y-1/2 text-caption text-green-600 pointer-events-none">
        {yesLabel}
      </span>

      {/* Source handle — bottom ("no") */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="no"
        className="!w-2.5 !h-2.5 !bg-red-500 !border-2 !border-white"
      />
      <span className="absolute bottom-[-14px] left-1/2 -translate-x-1/2 text-caption text-red-600 pointer-events-none">
        {noLabel}
      </span>
    </div>
  );
};

export default DecisionNode;
