/**
 * @module components/toolbar/ProjectName
 * @description Inline-editable project name displayed in the toolbar.
 * Click to enter edit mode; press Enter to confirm or Escape to cancel.
 *
 * @owner Team Gamma (UI Components)
 * @dependencies stores/projectStore
 */

import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { useProjectStore } from '@/stores/projectStore';

/** Inline-editable project name for the toolbar. */
export function ProjectName(): React.JSX.Element {
  const project = useProjectStore((s) => s.project);
  const setProjectName = useProjectStore((s) => s.setProjectName);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const displayName = project?.name ?? 'Untitled Project';

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  /** Enter edit mode and seed the draft with the current name. */
  const startEditing = (): void => {
    setDraft(displayName);
    setIsEditing(true);
  };

  /** Confirm the edit and persist it to the store. */
  const confirm = (): void => {
    const trimmed = draft.trim();
    if (trimmed.length > 0) {
      setProjectName(trimmed);
    }
    setIsEditing(false);
  };

  /** Cancel editing and discard changes. */
  const cancel = (): void => {
    setIsEditing(false);
  };

  /** Handle keyboard events in the input. */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      confirm();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={confirm}
        onKeyDown={handleKeyDown}
        className="bg-transparent border border-blue-400 rounded px-2 py-0.5 text-sm
                   font-semibold outline-none focus:ring-1 focus:ring-blue-400
                   max-w-[200px]"
        aria-label="Project name"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={startEditing}
      className="text-sm font-semibold truncate max-w-[200px] hover:underline
                 cursor-pointer px-1 py-0.5 rounded
                 hover:bg-gray-100 dark:hover:bg-gray-700"
      aria-label="Edit project name"
      title="Click to rename project"
    >
      {displayName}
    </button>
  );
}
