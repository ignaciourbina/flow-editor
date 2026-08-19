/**
 * @module components/ui/IconButton
 * @description Reusable icon button with accessibility support, variant styles, and tooltip.
 *
 * @owner Team Gamma (UI Components)
 * @dependencies None
 */

import React from 'react';

/** Props for the IconButton component. */
export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The icon element to render inside the button. */
  icon: React.ReactNode;
  /** Accessible label applied as `aria-label` and `title` tooltip. */
  label: string;
  /** Visual variant controlling colors. @default 'default' */
  variant?: 'default' | 'ghost' | 'danger';
  /** Button size preset. @default 'md' */
  size?: 'sm' | 'md';
}

/** Tailwind classes per variant. */
const VARIANT_CLASSES: Record<NonNullable<IconButtonProps['variant']>, string> = {
  default:
    'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
  ghost:
    'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200',
  danger:
    'bg-transparent text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/30',
};

/** Tailwind classes per size. */
const SIZE_CLASSES: Record<NonNullable<IconButtonProps['size']>, string> = {
  sm: 'h-7 w-7 p-1',
  md: 'h-8 w-8 p-1.5',
};

/**
 * A small icon-only button with built-in tooltip, aria-label, and variant styling.
 *
 * @example
 * ```tsx
 * <IconButton icon={<Trash2 size={16} />} label="Delete node" variant="danger" />
 * ```
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { icon, label, variant = 'default', size = 'md', className = '', disabled, ...rest },
    ref,
  ): React.ReactElement {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        title={label}
        disabled={disabled}
        className={`
          inline-flex items-center justify-center rounded-md
          transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
          disabled:pointer-events-none disabled:opacity-40
          ${VARIANT_CLASSES[variant]}
          ${SIZE_CLASSES[size]}
          ${className}
        `.trim()}
        {...rest}
      >
        {icon}
      </button>
    );
  },
);
