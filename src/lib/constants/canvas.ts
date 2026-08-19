/**
 * @module lib/constants/canvas
 * @description Canvas-related constants: theme cycles, background variants, and grid configurations.
 *
 * @owner Team Alpha (Foundation)
 * @dependencies BackgroundVariant from @xyflow/react
 */

import { BackgroundVariant } from '@xyflow/react';
import type { ThemeMode } from '@/types';

/**
 * Cycle order for the theme toggle button.
 * 
 * Defines the progression when users click the theme toggle:
 * light → dark → system → light (loop)
 */
export const THEME_CYCLE: Record<ThemeMode, ThemeMode> = {
  light: 'dark',
  dark: 'system',
  system: 'light',
} as const;

/**
 * Maps user-friendly background pattern names to React Flow's BackgroundVariant enum.
 * 
 * Used by CanvasBackground component to convert string props to typed variants.
 * Note: 'dashed' is an alias for 'lines' for backwards compatibility.
 */
export const VARIANT_MAP: Record<string, BackgroundVariant> = {
  dots: BackgroundVariant.Dots,
  lines: BackgroundVariant.Lines,
  cross: BackgroundVariant.Cross,
  dashed: BackgroundVariant.Lines,
} as const;
