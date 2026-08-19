/**
 * @module components/panels/export-panel/ExportPanel
 * @description Panel for choosing an export format and triggering a download with validation.
 * Validates the flow before export and displays errors/warnings.
 * Currently supports JSON export; PNG and SVG are shown as disabled placeholders.
 *
 * @owner Team Gamma (UI Components)
 * @dependencies lib/export, stores/flowStore, stores/uiStore, file-saver
 */

import React, { useCallback, useState } from 'react';
import { Download, AlertCircle, AlertTriangle } from 'lucide-react';
import { saveAs } from 'file-saver';
import { useFlowStore } from '@/stores/flowStore';
import { useUiStore } from '@/stores/uiStore';
import { toJson, assembleFlowProject } from '@/lib/export';
import { PanelContainer } from '@/components/ui/PanelContainer';
import type { ExportFormat, ValidationResult } from '@/types/ui';

/** Metadata for each export format option. */
interface FormatOption {
  value: ExportFormat;
  label: string;
  disabled: boolean;
}

const FORMAT_OPTIONS: FormatOption[] = [
  { value: 'json', label: 'JSON', disabled: false },
  { value: 'png', label: 'PNG', disabled: true },
  { value: 'svg', label: 'SVG', disabled: true },
];

/**
 * Export panel allowing the user to pick a format and download the diagram.
 * Only JSON is functional for now; image formats are planned for a later phase.
 */
export function ExportPanel(): React.ReactElement {
  const [format, setFormat] = useState<ExportFormat>('json');
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const isExporting = useUiStore((s) => s.isExporting);
  const setExporting = useUiStore((s) => s.setExporting);

  const handleExport = useCallback((): void => {
    if (format !== 'json') return;
    setExporting(true);
    try {
      const { project, validation: validationResult } = assembleFlowProject(nodes, edges);
      setValidation(validationResult);
      
      const json = toJson(project);
      const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
      saveAs(blob, 'flow-export.json');
    } finally {
      setExporting(false);
    }
  }, [format, nodes, edges, setExporting]);

  return (
    <PanelContainer title="Export" side="right">
      <div className="space-y-4">
        {/* Format selector */}
        <fieldset className="space-y-1">
          <legend className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Format
          </legend>
          {FORMAT_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-2 rounded-md px-2 py-1 text-sm cursor-pointer transition-colors
                ${opt.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
                ${format === opt.value ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}
              `}
            >
              <input
                type="radio"
                name="export-format"
                value={opt.value}
                checked={format === opt.value}
                disabled={opt.disabled}
                onChange={() => setFormat(opt.value)}
                className="accent-blue-600"
              />
              {opt.label}
              {opt.disabled && (
                <span className="ml-auto text-label text-gray-400">(coming soon)</span>
              )}
            </label>
          ))}
        </fieldset>

        {/* Validation messages */}
        {validation && (validation.errors.length > 0 || validation.warnings.length > 0) && (
          <div className="space-y-2">
            {validation.errors.map((err, idx) => (
              <div key={`error-${idx}`} className="flex items-start gap-2 rounded-md bg-red-50 dark:bg-red-900/20 px-3 py-2 text-xs">
                <AlertCircle size={14} className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <span className="text-red-700 dark:text-red-300">{err.message}</span>
              </div>
            ))}
            {validation.warnings.map((warn, idx) => (
              <div key={`warning-${idx}`} className="flex items-start gap-2 rounded-md bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-xs">
                <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="text-amber-700 dark:text-amber-300">{warn.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Export button */}
        <button
          type="button"
          disabled={isExporting || format !== 'json'}
          onClick={handleExport}
          className="form-button"
        >
          <Download size={14} />
          {isExporting ? 'Exporting…' : 'Export'}
        </button>
      </div>
    </PanelContainer>
  );
}
