/**
 * @module stores/uiStore
 * @description Zustand store for UI state: active panels, theme, modals, command palette.
 *
 * @owner Team Beta (State & Logic)
 * @dependencies types/ui
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PanelId, ThemeMode } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Full shape of the UI store (state + actions). */
export interface UIStoreState {
  // --- State ---
  /** Currently open side panel, or `null` if all are collapsed. */
  activePanel: PanelId | null;
  /** Current theme mode. */
  theme: ThemeMode;
  /** Whether the Cmd+K command palette is visible. */
  isCommandPaletteOpen: boolean;
  /** Whether an export operation is in progress. */
  isExporting: boolean;
  /** Whether canvas grid pattern is visible. */
  showCanvasGrid: boolean;
  /** Canvas grid style variant. */
  canvasGridStyle: 'dots' | 'dashed' | 'cross';
  /** Canvas background color preset. */
  canvasBackgroundColor: 'beige' | 'grey' | 'black';

  // --- Actions ---
  /** Toggle a side panel open/closed. Closes if already active. */
  togglePanel: (panel: PanelId) => void;
  /** Set the theme mode. */
  setTheme: (theme: ThemeMode) => void;
  /** Open the command palette. */
  openCommandPalette: () => void;
  /** Close the command palette. */
  closeCommandPalette: () => void;
  /** Set the exporting flag. */
  setExporting: (value: boolean) => void;
  /** Toggle canvas grid visibility. */
  toggleCanvasGrid: () => void;
  /** Set the canvas grid style variant. */
  setCanvasGridStyle: (style: 'dots' | 'dashed' | 'cross') => void;
  /** Set the canvas background color preset. */
  setCanvasBackgroundColor: (color: 'beige' | 'grey' | 'black') => void;
  /** Whether the settings dialog is visible. */
  isSettingsOpen: boolean;
  /** Open the settings dialog. */
  openSettings: () => void;
  /** Close the settings dialog. */
  closeSettings: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useUiStore = create<UIStoreState>()(
  persist(
    (set) => ({
      activePanel: null,
      theme: 'system',
      isCommandPaletteOpen: false,
      isExporting: false,
      showCanvasGrid: true,
      canvasGridStyle: 'dots',
      canvasBackgroundColor: 'grey',
      isSettingsOpen: false,

      togglePanel: (panel) =>
        set((s) => ({ activePanel: s.activePanel === panel ? null : panel })),

      setTheme: (theme) => set({ theme }),

      openCommandPalette: () => set({ isCommandPaletteOpen: true }),

      closeCommandPalette: () => set({ isCommandPaletteOpen: false }),

      setExporting: (value) => set({ isExporting: value }),

      toggleCanvasGrid: () => set((s) => ({ showCanvasGrid: !s.showCanvasGrid })),

      setCanvasGridStyle: (style) => set({ canvasGridStyle: style }),

      setCanvasBackgroundColor: (color) => set({ canvasBackgroundColor: color }),

      openSettings: () => set({ isSettingsOpen: true }),

      closeSettings: () => set({ isSettingsOpen: false }),
    }),
    {
      name: 'flow-editor-ui-preferences',
      version: 1,
      partialize: (state) => ({
        theme: state.theme,
        showCanvasGrid: state.showCanvasGrid,
        canvasGridStyle: state.canvasGridStyle,
        canvasBackgroundColor: state.canvasBackgroundColor,
      }),
    },
  ),
);

/** @deprecated Use useUiStore instead. */
export const useUIStore = useUiStore;
