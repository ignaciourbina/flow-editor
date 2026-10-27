/**
 * @module components/ui/PanelContainer
 * @description Shared shell wrapper for all side panels (palette, properties, export).
 * Provides a fixed-width sidebar with a header and scrollable content area.
 *
 * @owner Team Gamma (UI Components)
 * @dependencies None
 */

import React from 'react';

/** Props for the PanelContainer component. */
export interface PanelContainerProps {
  /** Panel header title text. */
  title: string;
  /** Which side of the canvas the panel attaches to. */
  side: 'left' | 'right';
  /** Panel body content. */
  children: React.ReactNode;
  /** Additional CSS classes appended to the root element. */
  className?: string;
  /**
   * Below the `md` breakpoint, whether the panel is open as an overlay on the
   * canvas. Omit to keep the panel beside the canvas at every width.
   */
  mobileOpen?: boolean;
}

/**
 * Shared panel shell that wraps every side panel.
 *
 * Renders a fixed-width (`w-64`) sidebar spanning the full viewport height
 * with a header row and a scrollable content area. Panels given `mobileOpen`
 * are hidden on narrow screens until opened, so the canvas keeps the width.
 */
export function PanelContainer({
  title,
  side,
  children,
  className = '',
  mobileOpen,
}: PanelContainerProps): React.ReactElement {
  const borderClass = side === 'left' ? 'border-r' : 'border-l';
  const displayClass =
    mobileOpen === undefined
      ? 'flex'
      : `${mobileOpen ? 'flex' : 'hidden'} absolute inset-y-0 ${side === 'left' ? 'left-0' : 'right-0'}
         z-20 max-w-[85vw] shadow-lg md:static md:flex md:shadow-none`;

  return (
    <aside
      className={`
        ${displayClass} h-full w-64 flex-col
        ${borderClass} border-gray-200 dark:border-gray-700
        bg-[var(--panel-bg,theme(colors.white))]
        ${className}
      `.trim()}
    >
      {/* Header */}
      <div className="flex items-center px-3 py-2 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 select-none">
          {title}
        </h2>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-3">
        {children}
      </div>
    </aside>
  );
}
