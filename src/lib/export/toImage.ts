/**
 * @module lib/export/toImage
 * @description Exports the canvas to PNG or SVG using html-to-image.
 *
 * @owner Team Delta (Persistence & Export)
 * @dependencies html-to-image
 */

import { toPng as htmlToPng, toSvg as htmlToSvg } from 'html-to-image';

/** Options for PNG image export. */
export interface PngExportOptions {
  /** Device pixel ratio multiplier (default: 2). */
  dpi?: number;
  /** CSS background color (default: '#ffffff'). */
  backgroundColor?: string;
}

/** Options for SVG export. */
export interface SvgExportOptions {
  /** CSS background color (default: '#ffffff'). */
  backgroundColor?: string;
}

/**
 * Converts a data-URL string to a Blob.
 *
 * @param dataUrl - A base64-encoded data URL.
 * @returns The decoded Blob.
 */
function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const header = parts[0] ?? '';
  const base64 = parts[1] ?? '';
  const mime = header.match(/:(.*?);/)?.[1] ?? 'image/png';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

/**
 * Exports the React Flow viewport element to a PNG Blob.
 *
 * @param element - The DOM element containing the React Flow canvas.
 * @param options - Export options (dpi multiplier, background).
 * @returns A PNG Blob.
 */
export async function toPng(
  element: HTMLElement,
  options?: PngExportOptions,
): Promise<Blob> {
  const pixelRatio = options?.dpi ?? 2;
  const backgroundColor = options?.backgroundColor ?? '#ffffff';

  const dataUrl = await htmlToPng(element, {
    pixelRatio,
    backgroundColor,
  });

  return dataUrlToBlob(dataUrl);
}

/**
 * Exports the React Flow viewport element to an SVG string.
 *
 * @param element - The DOM element containing the React Flow canvas.
 * @param options - Export options (background color).
 * @returns An SVG markup string.
 */
export async function toSvg(
  element: HTMLElement,
  options?: SvgExportOptions,
): Promise<string> {
  const backgroundColor = options?.backgroundColor ?? '#ffffff';

  return htmlToSvg(element, { backgroundColor });
}
