/**
 * @module lib/export/toJson
 * @description Serializes a FlowProject to a formatted JSON string.
 *
 * @owner Team Delta (Persistence & Export)
 * @dependencies types/project
 */

import type { FlowProject } from '@/types';
import { CURRENT_SCHEMA_VERSION } from '@/types';

/**
 * Serializes a FlowProject to a formatted JSON string.
 * Includes schemaVersion for future migration support.
 *
 * @param project - The project to serialize.
 * @returns A pretty-printed JSON string with 2-space indentation.
 */
export function toJson(project: FlowProject): string {
  const output: FlowProject = {
    ...project,
    schemaVersion: project.schemaVersion ?? CURRENT_SCHEMA_VERSION,
  };
  return JSON.stringify(output, null, 2);
}
