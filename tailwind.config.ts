/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          bg: 'var(--canvas-bg)',
          grid: 'var(--canvas-grid)',
        },
        panel: {
          bg: 'var(--panel-bg)',
          border: 'var(--panel-border)',
        },
        node: {
          start: 'var(--node-start)',
          end: 'var(--node-end)',
          process: 'var(--node-process)',
          decision: 'var(--node-decision)',
          data: 'var(--node-data)',
          note: 'var(--node-note)',
          api: 'var(--node-api)',
        },
      },
      /**
       * Custom font sizes for consistent typography
       * - label: 10px for small labels, badges, and UI hints
       * - caption: 9px for tiny captions and metadata
       */
      fontSize: {
        label: '0.625rem', // 10px
        caption: '0.5625rem', // 9px
      },
      /**
       * Custom node dimensions for consistent sizing
       * - node-sm: 70px for small nodes (e.g., decision diamond)
       * - node-md: 100px for medium nodes (default node width)
       * - node-lg: 120px for larger nodes (data nodes, min-widths)
       */
      width: {
        'node-sm': '70px',
        'node-md': '100px',
        'node-lg': '120px',
      },
      height: {
        'node-sm': '70px',
        'node-md': '100px',
        'node-lg': '120px',
      },
    },
  },
  plugins: [],
};
