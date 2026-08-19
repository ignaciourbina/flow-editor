/**
 * @module types/ui
 * @description Type definitions for UI state, panels, themes, and toolbar actions.
 *
 * @owner Team Alpha (Foundation)
 * @dependencies None (leaf module)
 */

// ---------------------------------------------------------------------------
// Panel identifiers
// ---------------------------------------------------------------------------

/** Identifiers for the collapsible side panels. */
export type PanelId = 'palette' | 'properties' | 'export';

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------

/** Theme mode options. */
export type ThemeMode = 'light' | 'dark' | 'system';

// ---------------------------------------------------------------------------
// Toolbar actions
// ---------------------------------------------------------------------------

/** Actions available from the toolbar. */
export interface ToolbarAction {
  /** Unique action identifier. */
  id: string;
  /** Display label for the action. */
  label: string;
  /** Lucide icon name. */
  icon: string;
  /** Keyboard shortcut display string (e.g., "Ctrl+Z"). */
  shortcut?: string;
  /** Whether the action is currently disabled. */
  disabled?: boolean;
  /** Handler function. */
  handler: () => void;
}

// ---------------------------------------------------------------------------
// Command palette
// ---------------------------------------------------------------------------

/** A command registered in the command palette (Cmd+K). */
export interface CommandItem {
  /** Unique command identifier. */
  id: string;
  /** Display label. */
  label: string;
  /** Category grouping (e.g., "Nodes", "Edit", "Export"). */
  category: string;
  /** Lucide icon name. */
  icon?: string;
  /** Keyboard shortcut string. */
  shortcut?: string;
  /** Handler when the command is executed. */
  handler: () => void;
}

// ---------------------------------------------------------------------------
// Drag and drop
// ---------------------------------------------------------------------------

/** Data transferred during drag-and-drop from the node palette. */
export interface NodeDragData {
  /** The node type being dragged. */
  nodeType: string;
}

// ---------------------------------------------------------------------------
// Validation result
// ---------------------------------------------------------------------------

/** Result object returned by the flow validator. */
export interface ValidationResult {
  /** Whether the flow passed all checks. */
  valid: boolean;
  /** Non-critical issues (e.g., orphan nodes). */
  warnings: ValidationMessage[];
  /** Critical issues (e.g., no start node). */
  errors: ValidationMessage[];
}

/** A single validation message with context. */
export interface ValidationMessage {
  /** Machine-readable code (e.g., 'NO_START_NODE'). */
  code: string;
  /** Human-readable message. */
  message: string;
  /** IDs of the nodes/edges involved. */
  relatedIds?: string[];
}

// ---------------------------------------------------------------------------
// Export options
// ---------------------------------------------------------------------------

/** Supported export format identifiers. */
export type ExportFormat = 'json' | 'png' | 'svg' | 'mermaid';

/** Options passed to export functions. */
export interface ExportOptions {
  /** Export format. */
  format: ExportFormat;
  /** DPI multiplier for image exports (default: 2). */
  dpi?: number;
  /** Whether to include the background in image exports. */
  includeBackground?: boolean;
}
