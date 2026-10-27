/**
 * @module app/App
 * @description Root application component. Composes Toolbar, FlowCanvas, side panels,
 * and the CommandPalette overlay into the main layout. Registers global keyboard
 * shortcuts and auto-save on mount.
 *
 * @owner Shared (Integration)
 * @dependencies components/toolbar, components/canvas, components/panels,
 *               components/command-palette, hooks, stores
 */

import React, { useEffect } from 'react';
import { Toolbar } from '@/components/toolbar';
import { FlowCanvas } from '@/components/canvas/FlowCanvas';
import { NodePalette } from '@/components/panels/node-palette';
import { PropertyPanel } from '@/components/panels/property-panel';
import { ExportPanel } from '@/components/panels/export-panel';
import { CommandPalette } from '@/components/command-palette';
import { SettingsDialog } from '@/components/settings';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useUiStore } from '@/stores/uiStore';
import { useProjectStore } from '@/stores/projectStore';
import { useFlowStore } from '@/stores/flowStore';
import { createProject } from '@/lib/factories/projectFactory';
import { listProjects, loadProject } from '@/lib/persistence';

/**
 * Root application shell.
 *
 * Layout (top → bottom):
 * - Toolbar (fixed height)
 * - Main area (flex row): NodePalette | FlowCanvas | PropertyPanel
 * - ExportPanel (conditionally rendered)
 * - CommandPalette (overlay)
 */
const App: React.FC = () => {
  useKeyboardShortcuts();
  useAutoSave();

  const activePanel = useUiStore((s) => s.activePanel);
  const isCommandPaletteOpen = useUiStore((s) => s.isCommandPaletteOpen);

  // Load the most recent project from IndexedDB, or create a fresh one
  useEffect(() => {
    const projectStore = useProjectStore.getState();
    if (projectStore.project) return;

    listProjects()
      .then(async (summaries) => {
        const mostRecent = summaries[0];
        if (mostRecent) {
          const saved = await loadProject(mostRecent.id);
          if (saved) {
            projectStore.setProject(saved);
            useFlowStore.setState({
              nodes: saved.flow.nodes,
              edges: saved.flow.edges,
            });
            return;
          }
        }
        projectStore.setProject(createProject('Untitled Project', 'general'));
      })
      .catch(() => {
        projectStore.setProject(createProject('Untitled Project', 'general'));
      });
  }, []);

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Top toolbar */}
      <Toolbar />

      {/* Main editor area */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Left sidebar — Node palette */}
        <NodePalette />

        {/* Canvas — fills remaining space */}
        <div className="flex-1 relative">
          <FlowCanvas />
        </div>

        {/* Right sidebar — Property panel */}
        <PropertyPanel />
      </div>

      {/* Conditional export panel */}
      {activePanel === 'export' && <ExportPanel />}

      {/* Settings dialog */}
      <SettingsDialog />

      {/* Command palette overlay */}
      {isCommandPaletteOpen && <CommandPalette />}
    </div>
  );
};

export default App;
