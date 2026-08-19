/**
 * @module components/nodes/BaseNode
 * @description Foundational wrapper component for all node types.
 * Uses composition — domain-specific nodes wrap BaseNode with custom content.
 * Renders handles, icon, label, and optional children.
 *
 * @owner Team Gamma (UI Components)
 * @dependencies types/nodes
 */

import React, { useCallback, useMemo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

/** Handle descriptor for configuring source/target connection points. */
interface HandleDescriptor {
  /** Unique handle id (required when multiple handles share a position). */
  id?: string;
  /** Position on the node boundary. */
  position: Position;
  /** Optional label rendered next to the handle (for decision branches). */
  label?: string;
}

/** Props accepted by the BaseNode wrapper. */
export interface BaseNodeProps {
  /** Primary text displayed inside the node. */
  label: string;
  /** Optional icon element rendered to the left of the label. */
  icon?: React.ReactNode;
  /** Tailwind bg-color class or CSS color string for the header bar. */
  color?: string;
  /** Whether the node is currently selected in the canvas. */
  selected?: boolean;
  /** Additional CSS classes merged onto the outer container. */
  className?: string;
  /** Domain-specific content rendered below the label row. */
  children?: React.ReactNode;
  /** Source (output) handles — defaults to one handle at the bottom. */
  sourceHandles?: HandleDescriptor[];
  /** Target (input) handles — defaults to one handle at the top. */
  targetHandles?: HandleDescriptor[];
  /** Enable draggable ghost circles for handle repositioning. */
  repositionable?: boolean;
  /** Called when a handle is repositioned via ghost circle drag or click. */
  onReposition?: (handleType: 'source' | 'target', toPosition: Position) => void;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_TARGET: HandleDescriptor[] = [{ position: Position.Top }];
const DEFAULT_SOURCE: HandleDescriptor[] = [{ position: Position.Bottom }];

// ---------------------------------------------------------------------------
// Ghost handle repositioning
// ---------------------------------------------------------------------------

const ALL_CARDINAL = [Position.Top, Position.Bottom, Position.Left, Position.Right] as const;

/**
 * Absolute positioning for ghost circles at each cardinal direction.
 * 
 * The offset -14px centers the 28px ghost circle (3.5 * 4px = 14px) on the node boundary:
 * - Ghost circle diameter: 14px (w-3.5 h-3.5 in Tailwind)
 * - Half diameter: 7px
 * - Additional spacing: 7px for visual clearance
 * - Total offset: -14px from edge
 */
const GHOST_POS: Record<Position, React.CSSProperties> = {
  [Position.Top]:    { top: -14, left: '50%', transform: 'translateX(-50%)' },
  [Position.Bottom]: { bottom: -14, left: '50%', transform: 'translateX(-50%)' },
  [Position.Left]:   { left: -14, top: '50%', transform: 'translateY(-50%)' },
  [Position.Right]:  { right: -14, top: '50%', transform: 'translateY(-50%)' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * BaseNode — the foundational card used by every node variant.
 *
 * Renders a bordered card containing an icon slot, label, optional children,
 * and configurable Handle connection points.
 *
 * When `repositionable` is true, hovering the node reveals ghost circles at
 * each cardinal position. Drag from an occupied ghost to an empty one
 * (or click an empty ghost) to move the handle there.
 */
export const BaseNode: React.FC<BaseNodeProps> = ({
  label,
  icon,
  color = 'bg-white',
  selected = false,
  className = '',
  children,
  sourceHandles = DEFAULT_SOURCE,
  targetHandles = DEFAULT_TARGET,
  repositionable = false,
  onReposition,
}) => {
  const ringClass = selected ? 'ring-2 ring-blue-500' : '';

  // --- Reposition state ---------------------------------------------------
  const [isHovered, setIsHovered] = useState(false);

  /** Map each occupied cardinal position to its handle type. */
  const occupiedMap = useMemo(() => {
    const m = new Map<Position, 'source' | 'target'>();
    for (const h of targetHandles) m.set(h.position, 'target');
    for (const h of sourceHandles) m.set(h.position, 'source');
    return m;
  }, [sourceHandles, targetHandles]);

  const hasEmptySlots = useMemo(
    () => ALL_CARDINAL.some((p) => !occupiedMap.has(p)),
    [occupiedMap],
  );

  const clickGhost = useCallback(
    (toPosition: Position) => {
      if (!onReposition) return;
      if (sourceHandles.length > 0 && targetHandles.length === 0) {
        onReposition('source', toPosition);
      } else if (targetHandles.length > 0 && sourceHandles.length === 0) {
        onReposition('target', toPosition);
      } else if (sourceHandles.length > 0) {
        onReposition('source', toPosition);
      }
    },
    [onReposition, sourceHandles, targetHandles],
  );

  const showGhosts = repositionable && isHovered && hasEmptySlots;

  return (
    <div
      className={`
        relative rounded-lg border border-gray-300 bg-white shadow-sm
        min-w-[120px] text-xs
        ${ringClass} ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ---- Header row: icon + label ---- */}
      <div className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg ${color}`}>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="font-medium truncate">{label}</span>
      </div>

      {/* ---- Optional children slot ---- */}
      {children && <div className="px-3 py-2 border-t border-gray-200">{children}</div>}

      {/* ---- Target handles ---- */}
      {targetHandles.map((h, i) => (
        <Handle
          key={`target-${h.id ?? i}`}
          type="target"
          position={h.position}
          id={h.id}
          className="!w-2.5 !h-2.5 !bg-gray-400 !border-2 !border-white"
        />
      ))}

      {/* ---- Source handles ---- */}
      {sourceHandles.map((h, i) => (
        <React.Fragment key={`source-${h.id ?? i}`}>
          <Handle
            type="source"
            position={h.position}
            id={h.id}
            className="!w-2.5 !h-2.5 !bg-gray-600 !border-2 !border-white"
          />
          {h.label && (
            <span
              className="absolute text-label text-gray-500 pointer-events-none"
              style={{
                ...(h.position === Position.Right && { right: -20, top: '50%', transform: 'translateY(-50%)' }),
                ...(h.position === Position.Bottom && { bottom: -16, left: '50%', transform: 'translateX(-50%)' }),
              }}
            >
              {h.label}
            </span>
          )}
        </React.Fragment>
      ))}

      {/* ---- Ghost circles for handle repositioning (only at empty positions) ---- */}
      {showGhosts &&
        ALL_CARDINAL.map((pos) => {
          // Skip occupied positions — the real handle must stay interactive
          if (occupiedMap.has(pos)) return null;

          // Empty ghost: click to move the handle here
          return (
            <div
              key={`ghost-${pos}`}
              className="absolute z-20 w-3.5 h-3.5 rounded-full border-2 border-dashed border-gray-300 bg-gray-100/40 cursor-pointer hover:border-blue-400 hover:bg-blue-100/60 hover:scale-125 transition-all duration-150"
              style={GHOST_POS[pos]}
              onClick={() => clickGhost(pos)}
            />
          );
        })}
    </div>
  );
};

export default BaseNode;
