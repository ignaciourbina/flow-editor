/**
 * @module components/canvas/NoteEditorModal
 * @description Modal overlay for editing note node content (title and body).
 * Displayed when user right-clicks a note node and selects "Edit note content".
 *
 * @owner Team Gamma (UI Components)
 * @dependencies stores/flowStore
 */

import { useState } from 'react';

/** Props for the NoteEditorModal component. */
export interface NoteEditorModalProps {
  /** ID of the note node being edited. */
  nodeId: string;
  /** Initial title/label for the note. */
  initialLabel: string;
  /** Initial body content for the note. */
  initialBody: string;
  /** Callback invoked when user clicks Save. */
  onSave: (nodeId: string, label: string, body: string) => void;
  /** Callback invoked when user clicks Cancel or closes the modal. */
  onClose: () => void;
}

/**
 * Modal overlay for editing note node content.
 *
 * Provides input fields for note title and body with Save/Cancel actions.
 * Closes on cancel, escape, or clicking the backdrop.
 *
 * @example
 * ```tsx
 * <NoteEditorModal
 *   nodeId="note-1"
 *   initialLabel="My Note"
 *   initialBody="Note content..."
 *   onSave={(id, label, body) => updateNodeData(id, { label, body })}
 *   onClose={() => setNoteEditorState(null)}
 * />
 * ```
 */
export function NoteEditorModal({
  nodeId,
  initialLabel,
  initialBody,
  onSave,
  onClose,
}: NoteEditorModalProps): React.JSX.Element {
  const [label, setLabel] = useState(initialLabel);
  const [body, setBody] = useState(initialBody);

  const handleSave = (): void => {
    onSave(nodeId, label.trim() || 'Note', body);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-100">Edit note</h3>
        <label className="mb-1 block text-xs text-gray-500 dark:text-gray-300" htmlFor="note-editor-label">
          Title
        </label>
        <input
          id="note-editor-label"
          type="text"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          className="mb-3 w-full rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-900"
        />

        <label className="mb-1 block text-xs text-gray-500 dark:text-gray-300" htmlFor="note-editor-body">
          Body
        </label>
        <textarea
          id="note-editor-body"
          rows={5}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="mb-3 w-full rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-900"
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
