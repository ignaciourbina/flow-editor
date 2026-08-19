# Sprint Plan: Codebase Quality Hardening

> **Development need:** I need to do a quality check on this codebase. I need to keep component business logic decoupled, need clear TSDoc for scripts and methods and classes, need to be sure style drift is architecturally avoided, need typing and deterministic structures, and overall I need to plan for a growing containerized codebase, that is easy to navigate and inspect, and is well documented inside the script not in stale .md docs.
> **Date:** 2026-03-18
> **Status:** APPROVED — Open questions resolved, ready for execution

---

## 1. Situation Assessment

### Current State

The flow-editor is a React 18 + TypeScript + Vite application using React Flow (@xyflow/react), Zustand for state, Tailwind CSS for styling, and Radix UI for accessible primitives. The codebase has ~70 source files across a well-organized directory structure (`types/`, `stores/`, `hooks/`, `lib/`, `components/`, `templates/`).

**Strengths already in place:**
- **Module architecture is excellent.** Zero circular dependencies. Clean layered hierarchy: types → lib → stores → hooks → components. 100% `@/` alias usage (no `../../` imports). All 18 barrel `index.ts` files are complete with no missing re-exports.
- **Factory pattern fully enforced.** All 6 templates and all components use `createNode()`, `createEdge()`, `createProject()` from `lib/factories/`. No ad-hoc creation anywhere.
- **Type definitions are strong.** Discriminated unions (`NodeType`, `EdgeType`), type maps (`NodeDataMap`, `EdgeDataMap`), type guards (`isNodeType`, `isEdgeType`), proper use of `unknown` over `any`, `readonly` on constant arrays.
- **Documentation is 92.3%.** 143 of 155 exported symbols have TSDoc. Types (100%), stores (100%), lib (98%), hooks (98%) are all excellent. Templates follow a perfectly consistent pattern.
- **Dark mode support is comprehensive.** CSS variables for all theme tokens with `.dark` class variants.
- **Testing exists.** 19 test files covering stores, factories, validation, persistence, templates, and some components.

### Problem Statement

Despite strong foundations, five specific quality gaps threaten maintainability as the codebase grows:

1. **Type safety bypassed in component layer.** 8 node/edge components use `as unknown as T` double-casting to work around React Flow's untyped `data` prop. The `fromJson.ts` deserialization pipeline has 8+ unsafe type assertions. `EdgeProperties.tsx` falls back to `Record<string, unknown>` with downstream `as string` casts.

2. **Business logic coupled into components.** `FlowCanvas.tsx` is 45% logic (3 context menu states, inline note editor, edge mutation callbacks). `ExportPanel.tsx` assembles a `FlowProject` object and creates Blobs inline. `CommandPalette.tsx` uses non-idiomatic `getState()` and duplicates the Cmd+K listener from `useKeyboardShortcuts`. `NodeProperties.tsx` accepts field changes without validation.

3. **Design token drift.** Node colors are defined in 3 places: CSS variables (`globals.css`), `NODE_COLOR_MAP` in `CanvasMinimap.tsx`, and hardcoded hex strings in `NodePalette.tsx`. Canvas background colors exist only in JavaScript (`FlowCanvas.tsx` lines 89-99) with no CSS variable equivalents. Changing a node color requires updating 3 files.

4. **Style pattern duplication.** Form input classes (`w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-sm...`) are copy-pasted across `NodeProperties.tsx`, `EdgeProperties.tsx`, and `FlowCanvas.tsx`. Context menu styling is repeated 3 times in `FlowCanvas.tsx`. No `@layer components` utilities exist. Arbitrary pixel values (`text-[10px]`, `w-[70px]`) bypass the Tailwind scale.

5. **Documentation gaps in component helpers.** Toolbar helpers (`ThemeIcon`, `formatLastSaved`) lack TSDoc. Export helpers (`sanitizeId`, `nodeShape`, `edgeArrow` in `toMermaid.ts`) undocumented. `isEditableTarget()` in `useKeyboardShortcuts.ts` undocumented. Magic numbers (`GHOST_POS` offsets, `HEXAGON_CLIP` polygon) unexplained.

### Constraints & Risks

- **React Flow's `NodeProps.data` is typed as `any`** — this is a library constraint. The double-casting pattern exists because of it. The fix must introduce a type-safe wrapper without fighting the library.
- **Extracting logic from FlowCanvas is high-risk.** It's the central component with 419 lines. Splitting it requires careful state threading (menu position refs, ReactFlow instance access).
- **Changing color token architecture affects every visual element.** Must be done atomically — partial migration would leave two sources of truth.
- **No git repository initialized.** US-000 addresses this as a prerequisite. Until then, rollback relies on Dropbox versioning.

---

## 2. Target State

### Architecture After Changes

```
src/
├── types/                         # UNCHANGED — already excellent
├── stores/                        # UNCHANGED — already well-typed
├── hooks/
│   ├── useFlowStore.ts            # unchanged
│   ├── useUndoRedo.ts             # unchanged
│   ├── useAutoSave.ts             # unchanged
│   ├── useKeyboardShortcuts.ts    # TSDoc added to isEditableTarget
│   ├── useCanvasContextMenus.ts   # NEW: extracted from FlowCanvas
│   ├── useNodeHandleReposition.ts # NEW: shared by StartEndNode + NoteNode
│   └── index.ts                   # updated barrel
├── lib/
│   ├── constants/                 # NEW directory
│   │   ├── design-tokens.ts       # Single-source node colors, canvas colors
│   │   ├── canvas.ts              # Background/grid color maps, canvas defaults
│   │   └── index.ts
│   ├── export/
│   │   ├── assembleProject.ts     # NEW: extracted from ExportPanel
│   │   └── ...existing
│   ├── utils/                     # NEW directory
│   │   ├── formatting.ts          # formatLastSaved, etc.
│   │   └── index.ts
│   └── ...existing
├── components/
│   ├── nodes/
│   │   ├── types.ts               # NEW: type-safe NodeProps wrapper
│   │   └── ...existing (updated to use wrapper)
│   ├── canvas/
│   │   ├── FlowCanvas.tsx         # SLIMMED: logic extracted to hooks
│   │   ├── NoteEditorModal.tsx     # NEW: extracted from FlowCanvas
│   │   └── ...existing
│   └── ...existing
├── styles/
│   └── globals.css                # UPDATED: @layer components utilities added,
│                                  # canvas bg tokens added
└── tailwind.config.ts             # UPDATED: custom font sizes, node sizing scale
```

### Key Design Decisions

**Decision 1: Type-safe node props via wrapper type, not runtime validation.**
We'll create a `TypedNodeProps<T>` type that narrows `NodeProps['data']` to `NodeDataMap[T]`. Components will cast once at the boundary via a documented helper. *Alternative rejected:* Runtime type guards at every component — too expensive for a hot render path and overkill when the factory pattern already guarantees correct data shapes at creation time.

**Decision 2: Centralize colors in a TypeScript constant file, not just CSS variables.**
CSS variables are great for theming but can't be consumed by React Flow's minimap `nodeColor` callback (which needs hex strings). We'll create `lib/constants/design-tokens.ts` that exports the hex values, and `globals.css` will reference the same values. *Alternative rejected:* Using `getComputedStyle()` to read CSS vars at runtime — adds complexity and can't be statically analyzed.

**Decision 3: Extract `@layer components` utilities for repeated patterns, not React wrapper components.**
Tailwind `@apply` in `globals.css` keeps the styling layer flat and avoids component proliferation. *Alternative rejected:* Creating `<FormInput>`, `<FormLabel>` React components — premature abstraction for 3 input fields.

**Decision 4: Extract FlowCanvas logic into hooks, not sub-components.**
Menu state and note editing are tightly coupled to FlowCanvas callbacks. Custom hooks (`useCanvasContextMenus`) let the logic live close to the component while being testable in isolation. *Alternative rejected:* Splitting FlowCanvas into smaller components — the ReactFlow instance context makes this awkward and would increase prop threading.

---

## 3. Sprint Backlog

### Story Map

```
US-000 (git init) → ALL OTHER STORIES

US-001 (design tokens)  → US-004 (consume tokens in components)
                         ↘ US-008 (constants centralization)

US-002 (type-safe node props) — standalone

US-003 (style utilities) → US-010 (Tailwind config hardening)

US-005 (extract FlowCanvas logic + consolidate Cmd+K) — standalone

US-006 (extract ExportPanel + validate on export) — standalone

US-007 (TSDoc gap fill) — standalone

US-009 (shared hooks extraction) — standalone

US-011 (extensible node type registration) — depends on US-002
```

### User Stories

---

#### US-000: Initialize git repository with baseline commit

**Why this story exists:** The project has no version control. Every subsequent story benefits from atomic commits and safe rollback via `git revert`.

**What to change:**
- Initialize a git repository at the project root.
- Create a `.gitignore` (exclude `node_modules/`, `dist/`, `*.tsbuildinfo`, `.env`).
- Stage all existing files and create an initial commit.

**How to implement:**
- `git init`
- Create `.gitignore` following standard Vite + Node conventions.
- `git add .` then commit with message "Initial commit: flow-editor baseline before quality sprint".
- Verify with `git log --oneline`.

**Acceptance criteria:**
- [ ] `.git/` directory exists
- [ ] `.gitignore` excludes `node_modules/`, `dist/`, `*.tsbuildinfo`
- [ ] Initial commit contains all current source files
- [ ] `git status` shows clean working tree

**Depends on:** none
**Estimated complexity:** S

---

#### US-001: Centralize design tokens into single-source TypeScript constants

**Why this story exists:** Node colors are defined in 3 places (globals.css, CanvasMinimap.tsx, NodePalette.tsx). Changing a color requires editing 3 files, and they can silently drift.

**What to change:**
- `src/lib/constants/design-tokens.ts` (CREATE): Export `NODE_COLORS`, `CANVAS_BACKGROUNDS`, `CANVAS_GRIDS` as `const` objects mapping type keys to hex values.
- `src/lib/constants/index.ts` (CREATE): Barrel export.
- `src/styles/globals.css` (lines 23-29, 44-50): Add CSS variables for canvas backgrounds (`--canvas-bg-beige`, `--canvas-bg-grey`, `--canvas-bg-black` and grid equivalents). Keep existing `--node-*` vars but add a comment referencing `design-tokens.ts` as canonical source.

**How to implement:**
- Create `src/lib/constants/` directory.
- In `design-tokens.ts`, define all color hex values as a single `const` object with TSDoc explaining this is the single source of truth.
- Follow the pattern in `src/types/nodes.ts` for `readonly` const arrays with TSDoc.
- In `globals.css`, add the 6 missing canvas background/grid CSS variables to both `:root` and `.dark` blocks.

**Acceptance criteria:**
- [ ] `NODE_COLORS` object has keys for all 7 node types with correct hex values matching current `globals.css`
- [ ] `CANVAS_BACKGROUNDS` and `CANVAS_GRIDS` objects exist with `beige`, `grey`, `black` keys
- [ ] CSS variables `--canvas-bg-beige`, `--canvas-bg-grey`, `--canvas-bg-black`, `--canvas-grid-beige`, `--canvas-grid-grey`, `--canvas-grid-black` added to globals.css
- [ ] `tsc -b` passes with no errors
- [ ] File has TSDoc module header and all exports documented

**Depends on:** none
**Estimated complexity:** S

---

#### US-002: Create type-safe NodeProps wrapper and eliminate double-casting in node/edge components

**Why this story exists:** 8 component files use `as unknown as SpecificType` to work around React Flow's untyped `data` prop. This defeats TypeScript's type checking at the component layer.

**What to change:**
- `src/components/nodes/types.ts` (CREATE): Define `TypedNodeProps<T extends NodeType>` that properly narrows `data` to `NodeDataMap[T]`. Define `TypedEdgeProps<T extends EdgeType>` similarly.
- `src/components/nodes/ProcessNode.tsx` (line 27): Replace `data as unknown as ProcessNodeData` with typed prop destructuring.
- `src/components/nodes/DecisionNode.tsx` (line 26): Same.
- `src/components/nodes/ApiNode.tsx` (line 41): Same.
- `src/components/nodes/DataNode.tsx` (line 26): Same.
- `src/components/nodes/StartEndNode.tsx` (line 28): Same.
- `src/components/nodes/NoteNode.tsx` (line 28): Same.
- `src/components/edges/DefaultEdge.tsx` (line 41): Same for edge data.
- `src/components/edges/ConditionalEdge.tsx` (line 52): Same.
- `src/components/nodes/index.ts`: Update barrel to export types.

**How to implement:**
- Create `types.ts` following the pattern in `src/types/nodes.ts` for generic type narrowing.
- Define: `type TypedNodeProps<T extends NodeType> = Omit<NodeProps, 'data'> & { data: NodeDataMap[T] };`
- In each node component, change the function signature from `function ProcessNode({ data, ...props }: NodeProps)` to accept `TypedNodeProps<'process'>`.
- The `nodeTypes` registry in `components/nodes/index.ts` will need a cast at the registration boundary (one documented cast instead of 6 scattered ones).
- For edges, follow the same pattern with `TypedEdgeProps`.

**Acceptance criteria:**
- [ ] Zero `as unknown as` patterns remain in `src/components/nodes/` and `src/components/edges/`
- [ ] Type assertions are limited to the `nodeTypes`/`edgeTypes` registry objects (1 documented location)
- [ ] `TypedNodeProps` and `TypedEdgeProps` have full TSDoc
- [ ] `tsc -b` passes
- [ ] Existing tests in `tests/unit/components/nodes/` still pass

**Depends on:** none
**Estimated complexity:** M

---

#### US-003: Extract @layer components utilities for repeated style patterns

**Why this story exists:** Form input, label, button, select, and context menu classes are copy-pasted across 5+ component files. Any visual change requires updating all copies.

**What to change:**
- `src/styles/globals.css` (after line 60): Add `@layer components` block with `.form-label`, `.form-input`, `.form-select`, `.form-button`, `.context-menu`, `.context-menu-header`, `.context-menu-item` utilities.
- `src/components/panels/property-panel/NodeProperties.tsx` (lines 55, 60, 67, 74, 81, 87): Replace long class strings with utility classes.
- `src/components/panels/property-panel/EdgeProperties.tsx` (lines 48, 53, 60, 65): Same.
- `src/components/panels/export-panel/ExportPanel.tsx` (lines 33, 37, 71): Same.
- `src/components/canvas/FlowCanvas.tsx` (lines 278-310, 318-345, 350-365): Replace context menu class strings.

**How to implement:**
- Extract the common class string from `NodeProperties.tsx` line 60 as the canonical `.form-input` pattern.
- Extract the context menu pattern from `FlowCanvas.tsx` line 278 (`fixed z-50 rounded-md border...`) as `.context-menu`.
- Use `@apply` within `@layer components` so Tailwind purges correctly.
- Replace each duplicated class string in components with the utility class name.
- Keep component-specific additions (e.g., `readOnly` styling) as additional Tailwind classes alongside the utility.

**Acceptance criteria:**
- [ ] `globals.css` defines at least: `.form-label`, `.form-input`, `.form-select`, `.form-button`, `.context-menu`, `.context-menu-item`
- [ ] No identical Tailwind class strings >40 characters appear in more than one component file
- [ ] Visual appearance unchanged (verify with `npm run dev`)
- [ ] `npm run build` succeeds

**Depends on:** none
**Estimated complexity:** M

---

#### US-004: Consume centralized design tokens in all components

**Why this story exists:** After US-001 creates the single-source token file, components still have hardcoded hex values. This story wires them up.

**What to change:**
- `src/components/canvas/CanvasMinimap.tsx` (lines 19-41): Replace `NODE_COLOR_MAP` object with import from `@/lib/constants/design-tokens`.
- `src/components/panels/node-palette/NodePalette.tsx` (lines 41-64): Replace hardcoded hex `color` values in `CATEGORIES` with imports from design tokens.
- `src/components/canvas/FlowCanvas.tsx` (lines 89-99): Replace `backgroundColorMap` and `gridColorMap` with imports from `@/lib/constants`.
- `src/components/toolbar/Toolbar.tsx` (lines 145-169): Replace inline `backgroundColor` hex values with imports from constants.
- `src/components/canvas/CanvasBackground.tsx`: Use CSS variable for variant fallback if needed.

**How to implement:**
- In each file, replace the local `Record<string, string>` object with an import: `import { NODE_COLORS, CANVAS_BACKGROUNDS } from '@/lib/constants';`
- For CanvasMinimap's `nodeColor` callback, use `NODE_COLORS[type] ?? '#94a3b8'` (fallback to note color).
- For NodePalette, reference `NODE_COLORS` in the category definitions.
- For Toolbar color swatches, use `CANVAS_BACKGROUNDS` object values.
- Remove the now-unused local color map constants.

**Acceptance criteria:**
- [ ] Zero hardcoded hex color values remain in `src/components/` (excluding `ApiNode.tsx`'s `HEXAGON_CLIP` which is a CSS clip-path, not a color)
- [ ] All node color references trace back to `lib/constants/design-tokens.ts`
- [ ] All canvas background references trace back to `lib/constants/canvas.ts` or `lib/constants/design-tokens.ts`
- [ ] Visual appearance unchanged
- [ ] `tsc -b` passes

**Depends on:** US-001
**Estimated complexity:** S

---

#### US-005: Extract FlowCanvas business logic into hooks/sub-components and consolidate Cmd+K listener

**Why this story exists:** FlowCanvas.tsx is 419 lines with 45% logic. Three context menu states, an inline note editor, and edge mutation callbacks are all embedded in the component. Additionally, the Cmd+K keyboard listener is duplicated between `CommandPalette.tsx` and `useKeyboardShortcuts.ts`.

**What to change:**
- `src/hooks/useCanvasContextMenus.ts` (CREATE): Extract `menuState`, `edgeMenuState`, `nodeMenuState` state management and their open/close handlers.
- `src/components/canvas/NoteEditorModal.tsx` (CREATE): Extract the note editing overlay (FlowCanvas.tsx lines ~367-395) into a standalone component that takes `nodeId`, `initialContent`, `onSave`, `onClose` props.
- `src/components/canvas/FlowCanvas.tsx`: Import and use the new hook and component. Remove extracted logic. Target: <30% logic.
- `src/hooks/useKeyboardShortcuts.ts`: Ensure Cmd+K handling is the single authoritative listener that toggles the command palette via `uiStore.toggleCommandPalette()`.
- `src/components/command-palette/CommandPalette.tsx` (lines 73-83): Remove the duplicate Cmd+K `useEffect` listener. The component should only react to store state, not register its own global listener.
- `src/hooks/index.ts`: Add `useCanvasContextMenus` to barrel.

**How to implement:**
- **useCanvasContextMenus hook:** Move the three `useState` calls for menu states and the handler functions (`onNodeContextMenu`, `onEdgeContextMenu`, `onPaneContextMenu`, close handlers). Return the state + handlers as an object. Follow the pattern in `src/hooks/useUndoRedo.ts` for typing the return value.
- **NoteEditorModal:** Extract the `div` overlay with textarea + buttons. Accept typed props interface. Use the store's `updateNodeData` for save action.
- **FlowCanvas:** Replace inline state/handlers with hook calls. Replace inline note editor JSX with `<NoteEditorModal />`.
- **Cmd+K consolidation:** In `useKeyboardShortcuts.ts`, verify the Cmd+K handler calls `toggleCommandPalette()`. In `CommandPalette.tsx`, remove the `useEffect` that adds its own `keydown` listener for Cmd+K — the component should read `commandPaletteOpen` from `uiStore` and render conditionally.
- **Edge callbacks** (`updateEdgeType`, `updateEdgeEndMarker`): Keep in FlowCanvas for now — they're simple enough and tightly coupled to the ReactFlow `onEdgeClick` prop.

**Acceptance criteria:**
- [ ] `FlowCanvas.tsx` is under 300 lines
- [ ] `useCanvasContextMenus` hook is independently testable (returns typed state + handlers)
- [ ] `NoteEditorModal` has a typed props interface with TSDoc
- [ ] All three context menus still work correctly (node, edge, pane)
- [ ] Note editing (double-click note → edit → save/cancel) still works
- [ ] Cmd+K opens/closes command palette from a single listener in `useKeyboardShortcuts`
- [ ] No `keydown` event listener for Cmd+K in `CommandPalette.tsx`
- [ ] `tsc -b` passes

**Depends on:** none
**Estimated complexity:** L

---

#### US-006: Extract ExportPanel project assembly into lib/export with validation

**Why this story exists:** ExportPanel.tsx constructs a `FlowProject` object and serializes it to a Blob inline. This is export-domain logic that belongs in `lib/export/`, not in a UI component. Additionally, neither ExportPanel nor `toJson` validates the flow before export — users can export broken diagrams without warning.

**What to change:**
- `src/lib/export/assembleProject.ts` (CREATE): Export `assembleFlowProject(params): FlowProject` that takes nodes, edges, viewport, project metadata, returns a complete `FlowProject` object, and runs `validateFlow()` before returning. If validation finds errors, the function still returns the project but also returns the `ValidationResult` so the UI can warn the user.
- `src/lib/export/index.ts`: Add re-export.
- `src/components/panels/export-panel/ExportPanel.tsx` (lines 43-68): Replace inline assembly with call to `assembleFlowProject()`. Show validation warnings/errors to user before proceeding with export. Replace Blob creation with call to `toJson()` + `saveAs()` one-liner.

**How to implement:**
- Follow the pattern in `src/lib/export/toJson.ts` for function signature and TSDoc.
- The return type should be `{ project: FlowProject; validation: ValidationResult }`.
- Import `validateFlow` from `@/lib/validation` — this creates a clean dependency: `lib/export/assembleProject` → `lib/validation`. Both are leaf-level lib modules depending only on `types/`, so no circular dependency risk.
- In ExportPanel, after calling `assembleFlowProject`, check `validation.errors`. If errors exist, show them (e.g., inline warning text). If only warnings, proceed with export but show them. If clean, export silently.
- Keep the `saveAs()` call in the component (it's a side effect triggered by user action — appropriate at the component level).

**Acceptance criteria:**
- [ ] `assembleFlowProject` has full TSDoc with @param and @returns
- [ ] Return type includes both `FlowProject` and `ValidationResult`
- [ ] ExportPanel's `handleExport` is under 15 lines
- [ ] Validation warnings/errors are displayed in the export panel UI
- [ ] JSON export still works (download produces valid JSON)
- [ ] Exporting a flow with no start node shows a validation error/warning
- [ ] `tsc -b` passes
- [ ] `tests/unit/lib/export/toJson.test.ts` still passes

**Depends on:** none
**Estimated complexity:** M

---

#### US-007: Fill TSDoc gaps in component helpers, hooks, and lib utilities

**Why this story exists:** 12 exported/internal helper functions lack TSDoc. Magic numbers and CSS constants are unexplained. For a growing codebase, undocumented helpers become maintenance traps.

**What to change:**
- `src/components/toolbar/Toolbar.tsx`: Add TSDoc to `ThemeIcon` component, `formatLastSaved()` function, `THEME_CYCLE` constant.
- `src/components/toolbar/ProjectName.tsx`: Add TSDoc to `handleConfirm`, `handleKeyDown` handlers, document the validation logic.
- `src/lib/export/toMermaid.ts`: Add TSDoc with @param/@returns to `sanitizeId()`, `nodeShape()`, `edgeArrow()`.
- `src/hooks/useKeyboardShortcuts.ts`: Add TSDoc to `isEditableTarget()` explaining why `EDITABLE_TAGS` set exists.
- `src/components/nodes/BaseNode.tsx`: Add comment explaining `GHOST_POS` offset values (-14px = half of 28px handle diameter to center at node boundary).
- `src/components/nodes/ApiNode.tsx`: Add comment explaining `HEXAGON_CLIP` polygon coordinates and `METHOD_COLORS` mapping.

**How to implement:**
- Follow the documentation patterns from `src/types/nodes.ts` (TSDoc with @example) and `src/lib/validation/flowValidator.ts` (algorithm description in JSDoc).
- For helper functions: minimum `@param` and `@returns` tags.
- For constants: one-line `/** */` comment above the declaration explaining purpose and derivation of magic values.
- For `formatLastSaved`: explain the time bracket logic (seconds → "just now", minutes → "X min ago", else → timestamp).

**Acceptance criteria:**
- [ ] All 6 files listed above have zero undocumented exported or significant internal functions
- [ ] All magic numbers have inline comments explaining their derivation
- [ ] `GHOST_POS` offsets explain the math (node boundary centering)
- [ ] `HEXAGON_CLIP` documents the polygon shape being drawn
- [ ] Documentation coverage exceeds 97% (up from 92.3%)

**Depends on:** none
**Estimated complexity:** S

---

#### US-008: Move scattered component constants to lib/constants

**Why this story exists:** Color maps, theme cycles, grid configurations, and HTTP method colors are scattered across component files. Some are duplicated (canvas colors appear in both FlowCanvas and Toolbar). These should live in `lib/constants/` for single-source-of-truth.

**What to change:**
- `src/lib/constants/canvas.ts` (CREATE): Move `backgroundColorMap`, `gridColorMap` (from FlowCanvas.tsx), `VARIANT_MAP` (from CanvasBackground.tsx), `THEME_CYCLE` (from Toolbar.tsx).
- `src/lib/constants/api-node.ts` (CREATE): Move `METHOD_COLORS` (from ApiNode.tsx), `HEXAGON_CLIP` (from ApiNode.tsx).
- `src/lib/constants/index.ts` (UPDATE): Add re-exports.
- `src/components/canvas/FlowCanvas.tsx` (lines 89-99): Remove local maps, import from constants.
- `src/components/canvas/CanvasBackground.tsx` (lines 32-37): Remove local `VARIANT_MAP`, import from constants.
- `src/components/toolbar/Toolbar.tsx` (lines 18-22): Remove `THEME_CYCLE`, import from constants.
- `src/components/nodes/ApiNode.tsx` (lines 21-30): Remove `METHOD_COLORS` and `HEXAGON_CLIP`, import from constants.

**How to implement:**
- Group related constants by domain (canvas, api-node) not by file origin.
- Each constant file gets a module-level TSDoc comment.
- Each exported constant gets a `/** */` comment.
- Components switch to `import { THEME_CYCLE } from '@/lib/constants';`.

**Acceptance criteria:**
- [ ] No component file defines a `const` color map, theme cycle, or visual configuration object (only imports them)
- [ ] `lib/constants/` has clear, documented files
- [ ] No duplicate constant values across the codebase
- [ ] `tsc -b` passes

**Depends on:** US-001 (design-tokens.ts must exist to avoid creating conflicting constant files)
**Estimated complexity:** S

---

#### US-009: Extract shared hooks for duplicated component logic

**Why this story exists:** Handle repositioning logic is duplicated in StartEndNode.tsx and NoteNode.tsx (identical callbacks). Inline editing pattern in ProjectName.tsx (edit mode + draft state + keyboard handling) is a reusable pattern.

**What to change:**
- `src/hooks/useNodeHandleReposition.ts` (CREATE): Extract the `handleReposition` callback shared by StartEndNode and NoteNode. Takes `nodeId`, returns `{ handleReposition }`.
- `src/components/nodes/StartEndNode.tsx` (lines 32-37): Replace local handler with hook.
- `src/components/nodes/NoteNode.tsx` (lines 32-37): Replace local handler with hook.
- `src/hooks/index.ts`: Update barrel.

**How to implement:**
- For `useNodeHandleReposition`: import `useFlowStore` (or use the store directly), get `updateNode` action, return a memoized callback. Follow the pattern in `src/hooks/useUndoRedo.ts`.
- The hook should accept `nodeId: string` and return `{ handleReposition: (handleId: string, newPosition: Position) => void }`.

**Acceptance criteria:**
- [ ] StartEndNode and NoteNode both use the shared hook
- [ ] Zero duplicated handler code between node components
- [ ] Hook has full TSDoc with @param and @returns
- [ ] Handle repositioning works correctly for both node types
- [ ] `tsc -b` passes

**Depends on:** none
**Estimated complexity:** S

---

#### US-010: Harden Tailwind config with project-specific scales

**Why this story exists:** Arbitrary pixel values (`text-[10px]`, `text-[9px]`, `w-[70px]`, `h-[100px]`) bypass the Tailwind design system. Custom scale tokens make these first-class citizens and prevent future arbitrary values.

**What to change:**
- `tailwind.config.ts` (extend section): Add custom `fontSize` entries (`label: '0.625rem'` for 10px, `caption: '0.5625rem'` for 9px), custom `width`/`height` entries (`node-sm: '70px'`, `node-md: '100px'`, `node-lg: '120px'`).
- `src/components/nodes/DecisionNode.tsx` (line 36): Replace `w-[70px] h-[70px]` with `w-node-sm h-node-sm`.
- `src/components/nodes/ApiNode.tsx` (line 47): Replace inline `style={{ width: 130, height: 110 }}` with Tailwind classes `w-[130px] h-[110px]` or custom scale.
- `src/components/nodes/NoteNode.tsx`: Replace `text-[10px]` with `text-label`.
- `src/components/nodes/DecisionNode.tsx`: Replace `text-[10px]` with `text-label`.
- `src/components/nodes/ApiNode.tsx`: Replace `text-[10px]` with `text-label`.
- Other files with `text-[9px]` or `text-[10px]`: Replace with `text-caption` or `text-label`.

**How to implement:**
- Add entries to `tailwind.config.ts` `theme.extend` following the existing pattern (lines 7-26).
- Search all `.tsx` files for `text-\[` and `w-\[` patterns to find all arbitrary values.
- Replace each with the named scale value.
- Document the custom scale in TSDoc comments in the config file.

**Acceptance criteria:**
- [ ] Zero `text-[10px]` or `text-[9px]` occurrences in component files (replaced with `text-label` / `text-caption`)
- [ ] Node sizing uses named classes where practical
- [ ] `tailwind.config.ts` has TSDoc comments explaining the custom scales
- [ ] Visual appearance unchanged
- [ ] `npm run build` succeeds

**Depends on:** US-003 (globals.css must be updated first to avoid conflicts)
**Estimated complexity:** S

---

#### US-011: Design extensible node type registration for easy addition of new node types

**Why this story exists:** New node types are planned. Currently, adding a node type requires changes in 5+ files (types/nodes.ts, nodeFactory.ts defaults, node component, nodeTypes registry, NodePalette categories, CanvasMinimap colors). This story makes it a 1-file-per-component change.

**What to change:**
- `src/types/nodes.ts`: Add TSDoc explaining the "how to add a new node type" checklist directly in the type file, referencing the exact locations.
- `src/components/nodes/index.ts`: Refactor `nodeTypes` registry to be built from a `NODE_REGISTRY` array that co-locates component, default data, palette metadata (icon, color, category), and type key. This replaces the current separate `nodeTypes` object + scattered `CATEGORIES` in NodePalette.
- `src/components/panels/node-palette/NodePalette.tsx`: Replace hardcoded `CATEGORIES` array with data derived from the `NODE_REGISTRY`.
- `src/lib/factories/nodeFactory.ts`: Replace `NODE_DEFAULTS` with a lookup into the registry or keep the factory defaults but document that new node types must add their default here.

**How to implement:**
- Create a `NodeRegistryEntry` interface:
  ```typescript
  interface NodeRegistryEntry<T extends NodeType> {
    type: T;
    component: ComponentType<TypedNodeProps<T>>;
    defaultData: NodeDataMap[T];
    palette: { label: string; icon: ComponentType; color: string; category: string };
  }
  ```
- Build `NODE_REGISTRY` as a `readonly` array of entries in `components/nodes/index.ts`.
- Derive `nodeTypes` (for React Flow) and palette categories (for NodePalette) from the same array.
- Follow the pattern in `src/types/nodes.ts` where `CORE_NODE_TYPES` and `DOMAIN_NODE_TYPES` are `as const` arrays.
- Update the "how to add a node type" TSDoc to say: "Add an entry to `NODE_REGISTRY` in `components/nodes/index.ts` and add the type to `NodeType` union + `NodeDataMap` in `types/nodes.ts`."

**Acceptance criteria:**
- [ ] Adding a new node type requires only: (1) add type + data interface to `types/nodes.ts`, (2) create component file, (3) add entry to `NODE_REGISTRY`
- [ ] `nodeTypes` for React Flow is derived from registry (not manually maintained)
- [ ] NodePalette categories are derived from registry (not hardcoded)
- [ ] TSDoc in `types/nodes.ts` documents the "add a node type" checklist
- [ ] All existing node types are registered and work as before
- [ ] `tsc -b` passes
- [ ] `tests/unit/components/nodes/BaseNode.test.tsx` and `tests/unit/components/panels/NodePalette.test.tsx` still pass

**Depends on:** US-002 (TypedNodeProps must exist first)
**Estimated complexity:** M

---

## 4. Non-Goals & Scope Boundaries

This sprint explicitly will NOT do:

- **Wire up unused exports** (image export, import, project CRUD). These are planned features — activating them is a separate sprint. (Note: `validateFlow` IS now wired into the export pipeline via US-006.)
- **Create React wrapper components** for form fields (`<FormInput>`, `<FormLabel>`). Tailwind `@apply` utilities are sufficient for now.
- **Refactor CommandPalette's `useCommands` hook**. The non-idiomatic `getState()` pattern works and the fix requires rethinking the command registration system — out of scope. (Note: the Cmd+K listener duplication IS fixed in US-005.)
- **Add validation to NodeProperties field changes**. This requires defining per-node-type field schemas first — a feature sprint, not a quality sprint.
- **Remove dead code** (unused exports like `toPng`, `toSvg`, `toMermaid`, `fromJson`, persistence functions). These are intentionally pre-built for upcoming features.
- **Create a STYLE_GUIDE.md or DOCUMENTATION.md**. The documentation should live in the code (TSDoc), not in stale .md files — per the user's explicit preference.
- **Add new tests**. Test additions should accompany the feature sprint. This sprint modifies existing code to pass existing tests.

---

## 5. Testing Strategy

### Existing test coverage

| Test File | Covers | Relevant To |
|-----------|--------|-------------|
| `tests/unit/stores/flowStore.test.ts` | Flow state, node/edge CRUD | US-005 (FlowCanvas extraction) |
| `tests/unit/stores/uiStore.test.ts` | UI state, theme, panels | US-008 (constants extraction) |
| `tests/unit/stores/projectStore.test.ts` | Project metadata | US-006 (export assembly) |
| `tests/unit/lib/factories/nodeFactory.test.ts` | Node creation | US-002 (type-safe props) |
| `tests/unit/lib/factories/edgeFactory.test.ts` | Edge creation | US-002 (type-safe props) |
| `tests/unit/lib/export/toJson.test.ts` | JSON serialization | US-006 (export assembly) |
| `tests/unit/lib/import/fromJson.test.ts` | JSON deserialization | — |
| `tests/unit/lib/validation/flowValidator.test.ts` | Flow validation | — |
| `tests/unit/lib/persistence/indexedDb.test.ts` | IndexedDB CRUD | — |
| `tests/unit/components/nodes/BaseNode.test.tsx` | BaseNode rendering | US-002, US-009 |
| `tests/unit/components/nodes/NoteNode.test.tsx` | NoteNode rendering | US-009 |
| `tests/unit/components/canvas/FlowCanvas.test.tsx` | Canvas rendering | US-005 |
| `tests/unit/components/panels/NodePalette.test.tsx` | Palette rendering | US-004 |
| `tests/unit/components/toolbar/Toolbar.test.tsx` | Toolbar rendering | US-007, US-008 |
| `tests/unit/components/toolbar/ProjectName.test.tsx` | Inline editing | US-007 |
| `tests/unit/templates/templates.test.ts` | Template structure | — |
| `tests/e2e/basicFlow.spec.ts` | Full flow interaction | US-005 |

### Tests to update

- **US-002**: `BaseNode.test.tsx`, `NoteNode.test.tsx` may need prop type updates if component signatures change.
- **US-005**: `FlowCanvas.test.tsx` — if mocking changes due to extracted hook.
- **US-004**: `NodePalette.test.tsx` — if category data structure changes.

### New tests to write

No new test files required. All changes are refactoring (same behavior, different structure). Existing tests serve as regression guards.

### Manual verification

- **US-003, US-004, US-010**: Visual regression check — `npm run dev` and verify all node types, context menus, property panels, and toolbar look identical.
- **US-005**: Test all three context menus (right-click node, edge, canvas), note double-click-to-edit flow.
- **US-006**: Test JSON export button produces valid file.

---

## 6. Rollback Plan

With US-000 (git init), every story gets its own commit. Rollback for any story is `git revert <commit-hash>`.

**Safest execution order:** US-000 → US-001 → US-007 → US-009 → US-006 → US-002 → US-003 → US-004 → US-008 → US-005 → US-010 → US-011. This orders low-risk stories first and ensures dependencies are met.

For US-005 (highest risk — FlowCanvas refactor): the git commit from the previous story provides a safe restore point. If the refactor breaks context menus or note editing, `git revert` the commit.

---

## 7. Open Questions — RESOLVED

All questions resolved on 2026-03-18:

- [x] **Consolidate Cmd+K listener?** YES — Added to US-005. `useKeyboardShortcuts` becomes the single authoritative Cmd+K listener; `CommandPalette` removes its duplicate `useEffect`.
- [x] **Validate on export?** YES — Added to US-006. `assembleFlowProject` now calls `validateFlow()` and returns `{ project, validation }`. ExportPanel shows warnings/errors before proceeding.
- [x] **New node types planned?** YES — Added US-011 (extensible node type registration). `NODE_REGISTRY` pattern makes adding a node type a 2-file change (type definition + component + registry entry).
- [x] **Initialize git?** YES — Added US-000 as first story. All subsequent stories get atomic commits with safe `git revert` rollback.
