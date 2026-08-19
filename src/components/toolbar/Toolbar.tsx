/**
 * @module components/toolbar/Toolbar
 * @description Top toolbar spanning full width with project name, undo/redo,
 * theme toggle, export, and command palette launcher.
 *
 * @owner Team Gamma (UI Components)
 * @dependencies stores/flowStore, stores/uiStore, stores/projectStore
 */

import { Undo2, Redo2, Download, Sun, Moon, Monitor, Command, Settings } from 'lucide-react';
import { useFlowStore } from '@/stores/flowStore';
import { useUIStore } from '@/stores/uiStore';
import { useProjectStore } from '@/stores/projectStore';
import { ProjectName } from './ProjectName';
import type { ThemeMode } from '@/types';
import { THEME_CYCLE } from '@/lib/constants';

/** Icon for the current theme mode. */
function ThemeIcon({ mode }: { mode: ThemeMode }): React.JSX.Element {
  if (mode === 'dark') return <Moon className="w-4 h-4" />;
  if (mode === 'light') return <Sun className="w-4 h-4" />;
  return <Monitor className="w-4 h-4" />;
}

/** Format a relative-time label from an ISO timestamp. */
function formatLastSaved(iso: string | null): string {
  if (!iso) return 'Not saved';
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return 'Saved just now';
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `Saved ${mins}m ago`;
  return `Saved ${Math.floor(mins / 60)}h ago`;
}

/** Top toolbar bar spanning the full editor width. */
export function Toolbar(): React.JSX.Element {
  const undo = useFlowStore((s) => s.undo);
  const redo = useFlowStore((s) => s.redo);
  const canUndo = useFlowStore((s) => s.past.length > 0);
  const canRedo = useFlowStore((s) => s.future.length > 0);

  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);
  const togglePanel = useUIStore((s) => s.togglePanel);
  const openCommandPalette = useUIStore((s) => s.openCommandPalette);
  const openSettings = useUIStore((s) => s.openSettings);

  const lastSaved = useProjectStore((s) => s.lastSaved);

  return (
    <header
      className="flex items-center justify-between h-12 px-4 border-b
                 bg-white dark:bg-gray-900 select-none"
      role="toolbar"
      aria-label="Main toolbar"
    >
      {/* ---- Left: project name ---- */}
      <div className="flex items-center gap-2 min-w-0">
        <ProjectName />
      </div>

      {/* ---- Center: undo / redo ---- */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={undo}
          disabled={!canUndo}
          aria-label="Undo"
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700
                     disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={redo}
          disabled={!canRedo}
          aria-label="Redo"
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700
                     disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>

      {/* ---- Right: theme, export, command palette, save status ---- */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTheme(THEME_CYCLE[theme])}
          aria-label={`Theme: ${theme}`}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ThemeIcon mode={theme} />
        </button>

        <button
          type="button"
          onClick={() => togglePanel('export')}
          aria-label="Export"
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={openSettings}
          aria-label="Settings"
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Settings className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={openCommandPalette}
          aria-label="Open command palette"
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Command className="w-4 h-4" />
        </button>

        <span
          className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap
                     hidden sm:inline"
          aria-live="polite"
        >
          {formatLastSaved(lastSaved)}
        </span>
      </div>
    </header>
  );
}
