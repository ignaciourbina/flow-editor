/**
 * @module components/panels/property-panel/NodeProperties
 * @description Form fields for editing the selected node's data (label, description, color).
 * Reads the node from `flowStore` and dispatches `updateNodeData` / `removeNode`.
 *
 * @owner Team Gamma (UI Components)
 * @dependencies stores/flowStore, components/ui/IconButton
 */

import React, { useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import { useFlowStore } from '@/stores/flowStore';
import { IconButton } from '@/components/ui/IconButton';
import { NODE_COLORS } from '@/lib/constants/design-tokens';

/** Props for the NodeProperties form. */
export interface NodePropertiesProps {
  /** The ID of the node being edited. */
  nodeId: string;
}

/**
 * Property form for a single selected node.
 * Renders editable fields for label, description, and color,
 * plus a delete button at the bottom.
 */
export function NodeProperties({ nodeId }: NodePropertiesProps): React.ReactElement {
  const node = useFlowStore((s) => s.nodes.find((n) => n.id === nodeId));
  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const removeNode = useFlowStore((s) => s.removeNode);

  const handleChange = useCallback(
    (field: string, value: string): void => {
      updateNodeData(nodeId, { [field]: value });
    },
    [nodeId, updateNodeData],
  );

  const handleDelete = useCallback((): void => {
    removeNode(nodeId);
  }, [nodeId, removeNode]);

  if (!node) {
    return <p className="text-xs text-gray-400">Node not found.</p>;
  }

  const data = node.data;

  return (
    <div className="space-y-3">
      {/* Label */}
      <fieldset>
        <label htmlFor="node-label" className="form-label">
          Label
        </label>
        <input
          id="node-label"
          type="text"
          value={(data.label as string) ?? ''}
          onChange={(e) => handleChange('label', e.target.value)}
          className="form-input"
        />
      </fieldset>

      {/* Description */}
      <fieldset>
        <label htmlFor="node-description" className="form-label">
          Description
        </label>
        <textarea
          id="node-description"
          rows={3}
          value={(data.description as string) ?? ''}
          onChange={(e) => handleChange('description', e.target.value)}
          className="form-input resize-y"
        />
      </fieldset>

      {/* Color */}
      <fieldset>
        <label htmlFor="node-color" className="form-label">
          Color
        </label>
        <input
          id="node-color"
          type="color"
          value={(data.color as string) ?? NODE_COLORS.process}
          onChange={(e) => handleChange('color', e.target.value)}
          className="h-8 w-full cursor-pointer rounded-md border border-gray-300 dark:border-gray-600"
        />
      </fieldset>

      {/* Separator + Delete */}
      <hr className="border-gray-200 dark:border-gray-700" />
      <IconButton
        icon={<Trash2 size={14} />}
        label="Delete node"
        variant="danger"
        onClick={handleDelete}
      />
    </div>
  );
}
