/**
 * @module components/nodes/NoteNode
 * @description Annotation/Note node — dashed border, no handles by default.
 * Optionally enable handles via `data.connectable`.
 *
 * @owner Team Gamma (UI Components)
 * @dependencies components/nodes/BaseNode, types/nodes
 */

import React from 'react';
import { Position } from '@xyflow/react';
import { StickyNote } from 'lucide-react';
import { useNodeHandleReposition } from '@/hooks';
import { BaseNode } from './BaseNode';
import type { TypedNodeProps } from './types';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * NoteNode — lightweight annotation with a dashed border and no fill.
 * Displays an optional multi-line `body` text. Handles are disabled
 * unless `data.connectable` is explicitly true.
 */
const NoteNode: React.FC<TypedNodeProps<'note'>> = ({ id, data, selected, sourcePosition, targetPosition }) => {
  const hasHandles = data.connectable === true;
  const { handleReposition } = useNodeHandleReposition(id);

  return (
    <BaseNode
      label={data.label}
      icon={<StickyNote size={14} className="text-amber-700" />}
      color="bg-amber-100 text-amber-900"
      selected={selected}
      className="!border-amber-300 !bg-amber-50 shadow-[2px_4px_10px_rgba(0,0,0,0.08)] rotate-[-1deg]"
      sourceHandles={hasHandles ? [{ position: sourcePosition ?? Position.Bottom }] : []}
      targetHandles={hasHandles ? [{ position: targetPosition ?? Position.Top }] : []}
      repositionable={hasHandles}
      onReposition={handleReposition}
    >
      {data.body && (
        <p className="text-amber-900/80 text-label leading-snug whitespace-pre-wrap">
          {data.body}
        </p>
      )}
    </BaseNode>
  );
};

export default NoteNode;
