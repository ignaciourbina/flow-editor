/**
 * @module components/settings/SettingsDialog
 * @description Modal dialog for configuring editor preferences and project settings.
 * Consolidates canvas, appearance, and editor settings into a single panel.
 *
 * @owner Team Gamma (UI Components)
 * @dependencies @radix-ui/react-dialog, stores/uiStore, stores/projectStore
 */

import * as Dialog from '@radix-ui/react-dialog';
import { X, Sun, Moon, Monitor } from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';
import { useProjectStore } from '@/stores/projectStore';
import { CANVAS_BACKGROUNDS } from '@/lib/constants';
import type { ThemeMode } from '@/types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const THEME_OPTIONS: Array<{ value: ThemeMode; label: string; Icon: typeof Sun }> = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
];

const GRID_STYLE_OPTIONS: Array<{ value: 'dots' | 'dashed' | 'cross'; label: string }> = [
  { value: 'dots', label: 'Dots' },
  { value: 'dashed', label: 'Lines' },
  { value: 'cross', label: 'Cross' },
];

const BG_OPTIONS: Array<{ value: 'beige' | 'grey' | 'black'; label: string }> = [
  { value: 'beige', label: 'Beige' },
  { value: 'grey', label: 'Grey' },
  { value: 'black', label: 'Black' },
];

// ---------------------------------------------------------------------------
// Section heading
// ---------------------------------------------------------------------------

function SectionHeading({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
      {children}
    </h3>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/** Settings dialog for configuring editor and canvas preferences. */
export function SettingsDialog(): React.JSX.Element {
  const isOpen = useUiStore((s) => s.isSettingsOpen);
  const closeSettings = useUiStore((s) => s.closeSettings);

  // UI prefs (global, localStorage-persisted)
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);
  const showCanvasGrid = useUiStore((s) => s.showCanvasGrid);
  const toggleCanvasGrid = useUiStore((s) => s.toggleCanvasGrid);
  const canvasGridStyle = useUiStore((s) => s.canvasGridStyle);
  const setCanvasGridStyle = useUiStore((s) => s.setCanvasGridStyle);
  const canvasBackgroundColor = useUiStore((s) => s.canvasBackgroundColor);
  const setCanvasBackgroundColor = useUiStore((s) => s.setCanvasBackgroundColor);

  // Project settings (per-project, IndexedDB-persisted)
  const project = useProjectStore((s) => s.project);
  const updateProjectSettings = useProjectStore((s) => s.updateProjectSettings);
  const settings = project?.settings;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && closeSettings()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2
                     rounded-lg border border-gray-200 bg-white p-6 shadow-xl
                     dark:border-gray-700 dark:bg-gray-800
                     focus:outline-none"
        >
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Settings
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close settings"
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-6">
            {/* ---- Appearance ---- */}
            <section>
              <SectionHeading>Appearance</SectionHeading>
              <div className="space-y-3">
                {/* Theme */}
                <div>
                  <label className="form-label">Theme</label>
                  <div className="flex gap-1">
                    {THEME_OPTIONS.map(({ value, label, Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setTheme(value)}
                        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors
                          ${theme === value
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                          }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background color */}
                <div>
                  <label className="form-label">Background</label>
                  <div className="flex items-center gap-2">
                    {BG_OPTIONS.map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setCanvasBackgroundColor(value)}
                        aria-label={`Canvas ${label}`}
                        title={label}
                        className={`w-7 h-7 rounded border transition-shadow
                          ${canvasBackgroundColor === value
                            ? 'ring-2 ring-blue-500 border-blue-400'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                          }`}
                        style={{ backgroundColor: CANVAS_BACKGROUNDS[value] }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ---- Canvas ---- */}
            <section>
              <SectionHeading>Canvas</SectionHeading>
              <div className="space-y-3">
                {/* Show grid */}
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCanvasGrid}
                    onChange={toggleCanvasGrid}
                    className="accent-blue-600"
                  />
                  Show grid
                </label>

                {/* Grid style */}
                <div>
                  <label className="form-label" htmlFor="settings-grid-style">Grid style</label>
                  <select
                    id="settings-grid-style"
                    value={canvasGridStyle}
                    onChange={(e) => setCanvasGridStyle(e.target.value as 'dots' | 'dashed' | 'cross')}
                    className="form-select"
                    disabled={!showCanvasGrid}
                  >
                    {GRID_STYLE_OPTIONS.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Grid size */}
                {settings && (
                  <div>
                    <label className="form-label" htmlFor="settings-grid-size">
                      Grid size ({settings.gridSize}px)
                    </label>
                    <input
                      id="settings-grid-size"
                      type="range"
                      min={5}
                      max={50}
                      step={5}
                      value={settings.gridSize}
                      onChange={(e) => updateProjectSettings({ gridSize: Number(e.target.value) })}
                      className="w-full accent-blue-600"
                    />
                  </div>
                )}

                {/* Snap to grid */}
                {settings && (
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.snapToGrid}
                      onChange={() => updateProjectSettings({ snapToGrid: !settings.snapToGrid })}
                      className="accent-blue-600"
                    />
                    Snap to grid
                  </label>
                )}
              </div>
            </section>

            {/* ---- Editor ---- */}
            {settings && (
              <section>
                <SectionHeading>Editor</SectionHeading>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showMinimap}
                      onChange={() => updateProjectSettings({ showMinimap: !settings.showMinimap })}
                      className="accent-blue-600"
                    />
                    Show minimap
                  </label>
                </div>
              </section>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
