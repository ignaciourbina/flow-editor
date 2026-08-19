/**
 * @module components/panels/property-panel/PropertyPanel
 * @description Right sidebar panel for editing selected node/edge properties.
 * Shows the appropriate sub-form based on the current selection, or a help
 * message when nothing is selected.
 *
 * @owner Team Gamma (UI Components)
 * @dependencies stores/flowStore, components/ui/PanelContainer
 */

import React from 'react';
import { MousePointerClick } from 'lucide-react';
import { useFlowStore } from '@/stores/flowStore';
import { PanelContainer } from '@/components/ui/PanelContainer';
import { NodeProperties } from './NodeProperties';
import { EdgeProperties } from './EdgeProperties';

/**
 * Right-side property panel.
 *
 * - One node selected  → `NodeProperties`
 * - One edge selected  → `EdgeProperties`
 * - Nothing selected   → help message
 */
export function PropertyPanel(): React.ReactElement {
  const selectedNodeIds = useFlowStore((s) => s.selectedNodeIds);
  const selectedEdgeIds = useFlowStore((s) => s.selectedEdgeIds);

  const singleNodeId = selectedNodeIds.length === 1 ? selectedNodeIds[0] : null;
  const singleEdgeId =
    !singleNodeId && selectedEdgeIds?.length === 1 ? selectedEdgeIds[0] : null;

  return (
    <PanelContainer title="Properties" side="right">
      {singleNodeId ? (
        <NodeProperties nodeId={singleNodeId} />
      ) : singleEdgeId ? (
        <EdgeProperties edgeId={singleEdgeId} />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-gray-400 dark:text-gray-500">
          <MousePointerClick size={28} strokeWidth={1.5} />
          <p className="text-xs leading-relaxed">
            Select a node or edge to edit its properties.
          </p>
        </div>
      )}
    </PanelContainer>
  );
}
