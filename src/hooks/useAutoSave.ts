/**
 * @module hooks/useAutoSave
 * @description Hook that auto-saves the current project to IndexedDB on flow changes.
 * Debounces saves by 800ms to avoid excessive writes.
 *
 * @owner Team Delta (Persistence & Export)
 * @dependencies stores/flowStore, stores/projectStore, lib/persistence
 */

import { useEffect, useRef } from 'react';
import { useFlowStore } from '@/stores/flowStore';
import { useProjectStore } from '@/stores/projectStore';
import { saveProject } from '@/lib/persistence';
import type { FlowProject, FlowState } from '@/types';

/** Debounce interval in milliseconds. */
const DEBOUNCE_MS = 800;

/** Default viewport used when the store does not expose viewport state. */
const DEFAULT_VIEWPORT: FlowState['viewport'] = { x: 0, y: 0, zoom: 1 };

/**
 * Hook that auto-saves the current project to IndexedDB on flow changes.
 * Subscribes to flow nodes/edges and the project store. When any change is
 * detected, it waits 800ms (debounce) then persists the assembled
 * FlowProject to IndexedDB and updates the `lastSaved` timestamp.
 */
export function useAutoSave(): void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);

  const project = useProjectStore((s) => s.project);
  const setLastSaved = useProjectStore((s) => s.setLastSaved);

  useEffect(() => {
    if (!project) return;

    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      const fullProject: FlowProject = {
        ...project,
        updatedAt: new Date().toISOString(),
        flow: {
          nodes,
          edges,
          viewport: project.flow.viewport ?? DEFAULT_VIEWPORT,
        },
      };

      saveProject(fullProject)
        .then(() => {
          setLastSaved(new Date().toISOString());
        })
        .catch((err: unknown) => {
          console.error('[useAutoSave] Failed to save project:', err);
        });
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [nodes, edges, project, setLastSaved]);
}
