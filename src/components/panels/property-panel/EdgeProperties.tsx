/**
 * @module components/panels/property-panel/EdgeProperties
 * @description Form fields for editing the selected edge's data (label, type).
 * Reads edges from `flowStore` and dispatches `removeEdge`.
 *
 * @owner Team Gamma (UI Components)
 * @dependencies stores/flowStore, types/edges, components/ui/IconButton
 */

import React, { useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import { useFlowStore } from '@/stores/flowStore';
import { EDGE_TYPES } from '@/types/edges';
import type { EdgeType } from '@/types/edges';
import { IconButton } from '@/components/ui/IconButton';

/** Props for the EdgeProperties form. */
export interface EdgePropertiesProps {
  /** The ID of the edge being edited. */
  edgeId: string;
}

/**
 * Property form for a single selected edge.
 * Renders editable fields for label and type, plus a delete button.
 */
export function EdgeProperties({ edgeId }: EdgePropertiesProps): React.ReactElement {
  const edge = useFlowStore((s) => s.edges.find((e) => e.id === edgeId));
  const removeEdge = useFlowStore((s) => s.removeEdge);

  const handleDelete = useCallback((): void => {
    removeEdge(edgeId);
  }, [edgeId, removeEdge]);

  if (!edge) {
    return <p className="text-xs text-gray-400">Edge not found.</p>;
  }

  const data = (edge.data ?? {}) as Record<string, unknown>;

  return (
    <div className="space-y-3">
      {/* Label */}
      <fieldset>
        <label htmlFor="edge-label" className="form-label">
          Label
        </label>
        <input
          id="edge-label"
          type="text"
          value={(data.label as string) ?? ''}
          readOnly
          className="form-input"
        />
      </fieldset>

      {/* Edge Type */}
      <fieldset>
        <label htmlFor="edge-type" className="form-label">
          Type
        </label>
        <select
          id="edge-type"
          value={(edge.type as EdgeType) ?? 'default'}
          disabled
          className="form-select"
        >
          {EDGE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </fieldset>

      {/* Separator + Delete */}
      <hr className="border-gray-200 dark:border-gray-700" />
      <IconButton
        icon={<Trash2 size={14} />}
        label="Delete edge"
        variant="danger"
        onClick={handleDelete}
      />
    </div>
  );
}
