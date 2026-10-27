/**
 * @module components/panels/node-palette/NodePalette
 * @description Left sidebar panel with draggable node items grouped by category.
 * Categories and items are derived from the NODE_REGISTRY for single-source truth.
 *
 * @owner Team Gamma (UI Components)
 * @dependencies types/nodes, components/ui/PanelContainer, DraggableNodeItem, components/nodes
 */

import React, { useMemo } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { PanelContainer } from '@/components/ui/PanelContainer';
import { DraggableNodeItem } from './DraggableNodeItem';
import { NODE_REGISTRY } from '@/components/nodes';
import { useUiStore } from '@/stores/uiStore';

/** A palette category definition. */
interface PaletteCategory {
  id: string;
  label: string;
  items: Array<{
    nodeType: string;
    label: string;
    icon: React.ReactNode;
    color: string;
  }>;
}

/** Category display names for palette sections. */
const CATEGORY_LABELS: Record<string, string> = {
  terminals: 'Terminals',
  process: 'Process',
  logic: 'Logic',
  annotation: 'Annotation',
  data: 'Data',
  integration: 'Integration',
};

/**
 * Left-side palette listing all available node types grouped by category.
 * Users drag items onto the canvas to create nodes.
 *
 * Categories are automatically derived from NODE_REGISTRY entries.
 */
export function NodePalette(): React.ReactElement {
  const isOpen = useUiStore((s) => s.activePanel === 'palette');

  /**
   * Derive palette categories from NODE_REGISTRY.
   * Groups entries by category and transforms them into PaletteCategory format.
   */
  const categories = useMemo<PaletteCategory[]>(() => {
    const categoryMap = new Map<string, PaletteCategory['items']>();

    // Group registry entries by category
    for (const entry of NODE_REGISTRY) {
      if (!categoryMap.has(entry.category)) {
        categoryMap.set(entry.category, []);
      }
      categoryMap.get(entry.category)!.push({
        nodeType: entry.type,
        label: entry.label,
        icon: entry.icon,
        color: entry.color,
      });
    }

    // Convert map to array of PaletteCategory
    return Array.from(categoryMap.entries()).map(([categoryId, items]) => ({
      id: categoryId,
      label: CATEGORY_LABELS[categoryId] || categoryId,
      items,
    }));
  }, []);

  return (
    <PanelContainer title="Node Palette" side="left" mobileOpen={isOpen}>
      <Accordion.Root type="multiple" defaultValue={categories.map((c) => c.id)}>
        {categories.map((category) => (
          <Accordion.Item key={category.id} value={category.id} className="mb-2">
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-center justify-between rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                {category.label}
                <ChevronDown
                  size={14}
                  className="transition-transform group-data-[state=open]:rotate-180"
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="space-y-1 pt-1 overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              {category.items.map((item) => (
                <DraggableNodeItem
                  key={item.nodeType}
                  nodeType={item.nodeType}
                  label={item.label}
                  icon={item.icon}
                  color={item.color}
                />
              ))}
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </PanelContainer>
  );
}
