# Flow Editor

Browser-based diagram editor for process flows, research pipelines, and data
models. Drag nodes from a typed palette (terminals, process steps, decisions,
data stores, API elements — including research-specific nodes: Experiment,
Hypothesis, Analysis), connect them on a canvas, and export the result as an
image. Projects autosave to browser storage; nothing leaves the machine.

**Live:** https://ignaciourbina.github.io/flow-editor/

Built with React, @xyflow/react, zustand, and Tailwind. Design notes in
`BLUEPRINT.md`.

## Development

```
npm ci
npm run dev      # local dev server
npm test         # vitest (60 tests)
npm run build    # typecheck + production build
```
