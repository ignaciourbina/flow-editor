/**
 * @module components/command-palette/CommandPalette
 * @description Cmd+K command palette for quick actions: edit, view, and export.
 * Built on top of the `cmdk` library and rendered as a centered overlay.
 *
 * @owner Team Gamma (UI Components)
 * @dependencies cmdk, stores/flowStore, stores/uiStore
 */

import { useCallback } from 'react';
import { Command } from 'cmdk';
import {
  Undo2,
  Redo2,
  CheckSquare,
  XSquare,
  Palette,
  SlidersHorizontal,
  Map,
  FileJson,
  Image,
  FileCode,
} from 'lucide-react';
import { useFlowStore } from '@/stores/flowStore';
import { useUIStore } from '@/stores/uiStore';
import type { CommandItem } from '@/types';

/** Build the full list of command items wired to store actions. */
function useCommands(): CommandItem[] {
  const { undo, redo, selectAll, clearSelection } = useFlowStore.getState();
  const { togglePanel } = useUIStore.getState();

  return [
    // Edit
    { id: 'undo', label: 'Undo', category: 'Edit', icon: 'Undo2', shortcut: 'Ctrl+Z', handler: undo },
    { id: 'redo', label: 'Redo', category: 'Edit', icon: 'Redo2', shortcut: 'Ctrl+Shift+Z', handler: redo },
    { id: 'select-all', label: 'Select All', category: 'Edit', icon: 'CheckSquare', shortcut: 'Ctrl+A', handler: selectAll },
    { id: 'deselect', label: 'Deselect', category: 'Edit', icon: 'XSquare', shortcut: 'Escape', handler: clearSelection },
    // View
    { id: 'toggle-palette', label: 'Toggle Palette', category: 'View', icon: 'Palette', handler: () => togglePanel('palette') },
    { id: 'toggle-properties', label: 'Toggle Properties', category: 'View', icon: 'SlidersHorizontal', handler: () => togglePanel('properties') },
    { id: 'toggle-minimap', label: 'Toggle Minimap', category: 'View', icon: 'Map', handler: () => { /* minimap toggle via project settings */ } },
    // Export
    { id: 'export-json', label: 'Export JSON', category: 'Export', icon: 'FileJson', handler: () => togglePanel('export') },
    { id: 'export-png', label: 'Export PNG', category: 'Export', icon: 'Image', handler: () => togglePanel('export') },
    { id: 'export-svg', label: 'Export SVG', category: 'Export', icon: 'FileCode', handler: () => togglePanel('export') },
  ];
}

/** Map icon name strings to Lucide components. */
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Undo2, Redo2, CheckSquare, XSquare,
  Palette, SlidersHorizontal, Map,
  FileJson, Image, FileCode,
};

/** Centered overlay command palette powered by cmdk. */
export function CommandPalette(): React.JSX.Element | null {
  const isOpen = useUIStore((s) => s.isCommandPaletteOpen);
  const close = useUIStore((s) => s.closeCommandPalette);
  const commands = useCommands();

  /** Run a command and close the palette. */
  const execute = useCallback(
    (cmd: CommandItem): void => {
      cmd.handler();
      close();
    },
    [close],
  );

  if (!isOpen) return null;

  const groups = commands.reduce<Record<string, CommandItem[]>>((acc, cmd) => {
    (acc[cmd.category] ??= []).push(cmd);
    return acc;
  }, {});

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]
                 bg-black/40 backdrop-blur-sm"
      onClick={close}
      role="presentation"
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        className="w-full max-w-lg rounded-xl border bg-white dark:bg-gray-900
                   shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Command palette"
      >
        <Command label="Command palette" shouldFilter>
          <Command.Input
            placeholder="Type a command…"
            className="w-full px-4 py-3 text-sm border-b bg-transparent
                       outline-none placeholder:text-gray-400"
          />
          <Command.List className="max-h-72 overflow-y-auto p-2">
            <Command.Empty className="px-4 py-6 text-center text-sm text-gray-400">
              No results found.
            </Command.Empty>
            {Object.entries(groups).map(([category, items]) => (
              <Command.Group
                key={category}
                heading={category}
                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5
                           [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold
                           [&_[cmdk-group-heading]]:text-gray-400"
              >
                {items.map((cmd) => {
                  const Icon = cmd.icon ? ICONS[cmd.icon] : undefined;
                  return (
                    <Command.Item
                      key={cmd.id}
                      value={cmd.label}
                      onSelect={() => execute(cmd)}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm rounded
                                 cursor-pointer
                                 aria-selected:bg-blue-50 dark:aria-selected:bg-gray-800"
                    >
                      {Icon && <Icon className="w-4 h-4 text-gray-400" />}
                      <span className="flex-1">{cmd.label}</span>
                      {cmd.shortcut && (
                        <kbd className="text-label text-gray-400 font-mono">
                          {cmd.shortcut}
                        </kbd>
                      )}
                    </Command.Item>
                  );
                })}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
