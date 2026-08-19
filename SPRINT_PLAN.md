# Flow Editor — Parallel Development & Sprint Plan

> Organizational plan for 5 parallel teams to deliver Phases 1–3.  
> Coding constitution: **TDD · DRY · Strong Typing · Standardized Components · Factories · No Monoliths · TSDocs + Comments**

---

## 1. Team Organization

### 1.1 Team Assignments

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TEAM MAP → FOLDER OWNERSHIP                        │
├───────────────┬─────────────────────────────────────┬───────────────────────┤
│ Team          │ Folders Owned                        │ Delivers             │
├───────────────┼─────────────────────────────────────┼───────────────────────┤
│ Alpha         │ src/types/                           │ All type contracts   │
│ (Foundation)  │ tests/unit/types/                    │                      │
├───────────────┼─────────────────────────────────────┼───────────────────────┤
│ Beta          │ src/stores/                          │ State management,    │
│ (State &      │ src/hooks/useFlowStore.ts            │ undo/redo, factories,│
│  Logic)       │ src/hooks/useUndoRedo.ts             │ validation           │
│               │ src/lib/factories/                   │                      │
│               │ src/lib/validation/                  │                      │
│               │ tests/unit/stores/                   │                      │
│               │ tests/unit/lib/factories/            │                      │
│               │ tests/unit/lib/validation/           │                      │
├───────────────┼─────────────────────────────────────┼───────────────────────┤
│ Gamma         │ src/components/canvas/               │ All visual           │
│ (UI           │ src/components/nodes/                │ components,          │
│  Components)  │ src/components/edges/                │ keyboard shortcuts   │
│               │ src/components/panels/               │                      │
│               │ src/components/toolbar/              │                      │
│               │ src/components/command-palette/      │                      │
│               │ src/components/ui/                   │                      │
│               │ src/hooks/useKeyboardShortcuts.ts    │                      │
│               │ tests/unit/components/               │                      │
├───────────────┼─────────────────────────────────────┼───────────────────────┤
│ Delta         │ src/lib/export/                      │ Import, export,      │
│ (Persistence  │ src/lib/import/                      │ persistence, auto-   │
│  & Export)    │ src/lib/persistence/                 │ save                 │
│               │ src/components/panels/export-panel/  │                      │
│               │ src/hooks/useAutoSave.ts             │                      │
│               │ tests/unit/lib/export/               │                      │
│               │ tests/unit/lib/import/               │                      │
│               │ tests/unit/lib/persistence/          │                      │
├───────────────┼─────────────────────────────────────┼───────────────────────┤
│ Epsilon       │ src/templates/admin/                 │ Domain templates,    │
│ (Templates &  │ src/templates/research/              │ domain node configs  │
│  Domains)     │ src/templates/api/                   │                      │
│               │ src/templates/data/                  │                      │
│               │ src/templates/system/                │                      │
│               │ tests/unit/templates/                │                      │
├───────────────┼─────────────────────────────────────┼───────────────────────┤
│ Integration   │ src/app/                             │ App shell, E2E,      │
│ (Shared)      │ src/styles/                          │ CI/CD config         │
│               │ tests/e2e/                           │                      │
│               │ Config files (root)                  │                      │
└───────────────┴─────────────────────────────────────┴───────────────────────┘
```

### 1.2 Dependency Flow Between Teams

```
                    ┌──────────┐
                    │  Alpha   │  ← Types are the foundation
                    │ (Types)  │     Everyone depends on these
                    └────┬─────┘
                         │
            ┌────────────┼────────────┐
            │            │            │
       ┌────▼────┐  ┌────▼────┐  ┌───▼──────┐
       │  Beta   │  │  Gamma  │  │  Delta   │
       │(Stores) │  │  (UI)   │  │(Persist) │
       └────┬────┘  └────┬────┘  └────┬─────┘
            │            │            │
            │       ┌────▼────┐       │
            └──────►│ Epsilon │◄──────┘
                    │(Templat)│
                    └────┬────┘
                         │
                  ┌──────▼──────┐
                  │ Integration │
                  │  (App/E2E)  │
                  └─────────────┘
```

**Key rule:** Alpha ships type contracts first (Sprint 0). All other teams code against those types from day one.

### 1.3 Merge Contracts

| Rule | Detail |
|------|--------|
| **Branch naming** | `team/<team>/<feature>` e.g. `team/beta/flow-store` |
| **Interface-first PRs** | Types/interfaces merged before implementations |
| **No cross-folder edits** | Teams only edit files in their owned folders |
| **Barrel export convention** | Every folder has `index.ts` re-exporting public API |
| **Review gates** | Cross-team imports require approval from the exporting team |

---

## 2. Coding Constitution

These principles are **non-negotiable** across all teams:

### 2.1 TDD (Test-Driven Development)

```
RED   → Write a failing test for the next smallest behavior
GREEN → Write the minimum code to pass the test
REFACTOR → Clean up while tests stay green
```

- **Every PR must include tests** that were written before the implementation
- Test file lives in the mirror `tests/unit/` directory
- Coverage target: **80%+ per module** before merge
- Use `describe` / `it` blocks with clear BDD-style descriptions

### 2.2 DRY (Don't Repeat Yourself)

- Shared logic lives in `src/lib/` or `src/hooks/`
- Node creation → always use `nodeFactory`, never inline `{ id: ..., type: ... }`
- Edge creation → always use `edgeFactory`
- UI primitives → always use `src/components/ui/` wrappers, never raw HTML

### 2.3 Strong Typing

- **No `any`** — use `unknown` + type guards when type is truly unknown
- **No type assertions** (`as`) except in test files
- All function signatures must have **explicit return types**
- All component props must use **named interfaces** (not inline types)
- Enable `strict: true` in tsconfig

### 2.4 Standardized Components

- All nodes extend `BaseNode` via composition (not inheritance)
- All edges follow React Flow's custom edge pattern
- All panels use the same layout shell (`PanelContainer`)
- All forms use the same input primitives from `src/components/ui/`

### 2.5 Factories

- `nodeFactory.createNode(type, position)` — sole way to create nodes
- `edgeFactory.createEdge(source, target, type)` — sole way to create edges
- `projectFactory.createProject(name, domain)` — sole way to create projects
- Factories own ID generation (nanoid), defaults, and validation

### 2.6 No Monolith Scripts

- **Max ~150 lines per file** (soft limit, enforced in review)
- One component per file
- One store per file
- One factory per file
- Split large hooks into composable sub-hooks

### 2.7 Documentation

- **TSDocs** on all exported functions, interfaces, and types
- **Inline comments** on non-obvious logic (the _why_, not the _what_)
- **Module-level docblock** at the top of every file (`@module`, `@description`, `@owner`, `@dependencies`)

---

## 3. Sprint Plan — Phase 1 (MVP, v0.1)

### Sprint 0: Foundation Setup (3 days)

> **Goal:** Project bootstrap + type contracts that unblock all teams.  
> **Teams active:** Alpha, Integration

#### 0.1 Project Bootstrap (Integration)
- [ ] Initialize Vite + React + TypeScript project
- [ ] Configure `tsconfig.json` with `strict: true`, path aliases (`@/`)
- [ ] Install all dependencies (react-flow, zustand, tailwind, radix, vitest)
- [ ] Configure Vitest with React Testing Library
- [ ] Configure Tailwind CSS + PostCSS
- [ ] Configure ESLint + Prettier
- [ ] Set up `src/app/main.tsx` entry point rendering a placeholder

**Acceptance criteria:**
- `npm run dev` serves the app at localhost
- `npm test` runs Vitest with 0 tests passing (no failures)
- `npm run lint` passes with no errors
- `npm run build` produces a production bundle

**Test composition:**
- No unit tests yet (infrastructure only)
- Verify build pipeline works end-to-end

#### 0.2 Type Contracts (Alpha)
- [ ] Define `BaseNodeData` interface with `label`, `description?`, `color?`, `icon?`, `metadata?`
- [ ] Define `NodeType` union: `'start' | 'end' | 'process' | 'decision' | 'note'`
- [ ] Define `FlowNode<T>` generic type extending React Flow's `Node`
- [ ] Define `EdgeType` union: `'default' | 'conditional'`
- [ ] Define `FlowEdge` type extending React Flow's `Edge`
- [ ] Define `FlowProject` interface with `id`, `name`, `domain`, `flow`, `settings`, timestamps
- [ ] Define `ProjectDomain` union: `'general' | 'admin' | 'research' | 'api' | 'data' | 'system'`
- [ ] Define `ProjectSettings` interface

**Acceptance criteria:**
- All types compile with `tsc --noEmit`
- Types are re-exported from `src/types/index.ts`
- No `any` used anywhere
- TSDocs on every exported type

**Test composition:**
- `tests/unit/types/nodes.test.ts`: Type guard functions validate correct/incorrect data
- `tests/unit/types/edges.test.ts`: EdgeType validation

---

### Sprint 1: Canvas & State Core (5 days)

> **Goal:** Render an empty canvas with pan/zoom + functional stores.  
> **Teams active:** Alpha, Beta, Gamma, Delta — **all in parallel**

#### 1.1 Flow Store (Beta)
- [ ] Implement `flowStore` with Zustand:
  - `nodes: FlowNode[]`, `edges: FlowEdge[]`
  - `addNode(node)`, `removeNode(id)`, `updateNodeData(id, data)`
  - `addEdge(edge)`, `removeEdge(id)`
  - `onNodesChange(changes)`, `onEdgesChange(changes)` — React Flow callbacks
  - `selectedNodeIds: string[]`, `selectNode(id)`, `clearSelection()`
- [ ] Implement `useFlowStore` typed selector hook
- [ ] Implement undo/redo middleware (temporal zustand):
  - `undo()`, `redo()`, `canUndo`, `canRedo`
  - History depth: 30 steps

**Acceptance criteria:**
- Store actions mutate state correctly (verified by tests)
- Undo reverses the last action; redo re-applies it
- Selecting a node updates `selectedNodeIds`
- Removing a node also removes all connected edges

**Test composition:**
- `tests/unit/stores/flowStore.test.ts`:
  - `it('adds a node to the store')`
  - `it('removes a node and its connected edges')`
  - `it('updates node data immutably')`
  - `it('undoes the last action')`
  - `it('redoes an undone action')`
  - `it('limits history to 30 entries')`
  - `it('clears selection')`

#### 1.2 Factories (Beta)
- [ ] Implement `nodeFactory.createNode(type, position, overrides?)`:
  - Generates unique ID via `nanoid(8)`
  - Sets default data per node type (label, color, icon)
  - Returns strongly typed `FlowNode`
- [ ] Implement `edgeFactory.createEdge(source, target, type?, overrides?)`:
  - Generates unique ID
  - Defaults to type `'default'`
- [ ] Implement `projectFactory.createProject(name, domain)`:
  - Sets timestamps, empty flow, default settings

**Acceptance criteria:**
- Each factory produces a valid, strongly-typed object
- IDs are unique across multiple calls
- Default data matches the domain matrix in BLUEPRINT.md

**Test composition:**
- `tests/unit/lib/factories/nodeFactory.test.ts`:
  - `it('creates a node with unique ID')`
  - `it('applies default label for process node')`
  - `it('applies default label for decision node')`
  - `it('accepts position override')`
  - `it('merges custom data with defaults')`
- `tests/unit/lib/factories/edgeFactory.test.ts`:
  - `it('creates an edge with unique ID')`
  - `it('defaults to type default')`
  - `it('sets source and target correctly')`

#### 1.3 Empty Canvas (Gamma)
- [ ] Implement `FlowCanvas.tsx`:
  - Wrap `<ReactFlow>` with `<ReactFlowProvider>`
  - Wire `nodes` and `edges` from `flowStore`
  - Wire `onNodesChange`, `onEdgesChange`, `onConnect` callbacks
  - Enable pan and zoom
- [ ] Implement `CanvasBackground.tsx`:
  - Render dot grid background
- [ ] Implement `CanvasControls.tsx`:
  - Zoom in, zoom out, fit view buttons

**Acceptance criteria:**
- Canvas renders with dot background
- User can pan by dragging empty space
- User can zoom with scroll wheel
- Zoom controls work (in, out, fit)
- Adding a node via store shows it on canvas

**Test composition:**
- `tests/unit/components/canvas/FlowCanvas.test.tsx`:
  - `it('renders ReactFlow component')`
  - `it('displays nodes from store')`
  - `it('displays edges from store')`

#### 1.4 JSON Persistence (Delta)
- [ ] Implement `toJson(project: FlowProject): string`:
  - Serialize with schema version field
  - Pretty-print with 2-space indent
- [ ] Implement `fromJson(input: string): FlowProject`:
  - Parse and validate structure
  - Throw typed `ImportError` on invalid data
- [ ] Implement `indexedDb.saveProject(project)` / `loadProject(id)`:
  - Use `idb-keyval` for key-value IndexedDB storage
  - Key: project ID, Value: serialized FlowProject

**Acceptance criteria:**
- `toJson` → `fromJson` round-trip preserves all data
- Invalid JSON throws `ImportError` with descriptive message
- `saveProject` stores to IndexedDB; `loadProject` retrieves identically
- Schema version is present in exported JSON

**Test composition:**
- `tests/unit/lib/export/toJson.test.ts`:
  - `it('serializes a FlowProject to valid JSON')`
  - `it('includes schemaVersion field')`
  - `it('round-trips with fromJson')`
- `tests/unit/lib/import/fromJson.test.ts`:
  - `it('parses valid JSON into FlowProject')`
  - `it('throws ImportError on invalid schema')`
  - `it('handles missing optional fields gracefully')`
- `tests/unit/lib/persistence/indexedDb.test.ts`:
  - `it('saves and loads a project')`
  - `it('returns null for nonexistent project')`

---

### Sprint 2: Core Nodes & Edges (5 days)

> **Goal:** 5 draggable node types + 2 edge types on canvas.  
> **Teams active:** Beta, Gamma, Delta — **in parallel**

#### 2.1 BaseNode Component (Gamma)
- [ ] Implement `BaseNode.tsx`:
  - Renders label, icon slot, description tooltip
  - Source handle (bottom), Target handle (top)
  - Visual states: default, selected (blue ring), dragging (opacity)
  - Accepts `children` for domain-specific content
- [ ] Apply Tailwind styling with CSS custom properties for theming
- [ ] Ensure accessibility: focusable, aria-label

**Acceptance criteria:**
- BaseNode renders with label text
- Selected nodes show visual indicator
- Handles are visible and connectable
- Component accepts and renders children

**Test composition:**
- `tests/unit/components/nodes/BaseNode.test.tsx`:
  - `it('renders the node label')`
  - `it('renders source and target handles')`
  - `it('applies selected class when selected')`
  - `it('renders children inside the node body')`
  - `it('has accessible aria-label')`

#### 2.2 Domain Node Components (Gamma)
- [ ] Implement `StartEndNode.tsx`:
  - Pill/stadium shape via border-radius
  - Variant prop: `'start'` (source only) | `'end'` (target only)
  - Green (start) / Red (end) default colors
- [ ] Implement `ProcessNode.tsx`:
  - Rounded rectangle
  - 4 handles (top, bottom, left, right)
- [ ] Implement `DecisionNode.tsx`:
  - Diamond shape via CSS rotate(45deg)
  - Two labeled output handles: "Yes" (right), "No" (bottom)
- [ ] Implement `NoteNode.tsx`:
  - Dashed border, no handles by default
  - Inline-editable text body

**Acceptance criteria:**
- Each node type has a distinct visual shape
- Start node has only source handle; End node has only target handle
- Decision node shows labeled outputs
- All nodes use BaseNode composition (not duplication)

**Test composition:**
- One test file per node, e.g.:
  - `it('StartEndNode renders as start variant with source handle only')`
  - `it('DecisionNode renders diamond shape')`
  - `it('DecisionNode has Yes and No labeled handles')`
  - `it('NoteNode renders with dashed border')`

#### 2.3 Edge Components (Gamma)
- [ ] Implement `DefaultEdge.tsx`:
  - Smooth step path with arrow marker
  - Optional animated dash
- [ ] Implement `ConditionalEdge.tsx`:
  - Same path + inline label badge ("Yes" / "No")
  - Color-coded: green for yes, red for no

**Acceptance criteria:**
- Default edge renders between two nodes
- Conditional edge shows label badge on the path
- Edges are clickable/selectable

**Test composition:**
- `it('DefaultEdge renders a path between nodes')`
- `it('ConditionalEdge renders with label badge')`

#### 2.4 Auto-save Hook (Delta)
- [ ] Implement `useAutoSave()`:
  - Subscribe to flowStore changes
  - Debounce 800ms before saving to IndexedDB
  - Update `projectStore.lastSaved` timestamp
- [ ] Display "Saved" / "Saving…" indicator (tiny, non-intrusive)

**Acceptance criteria:**
- Modifying the flow triggers a save after 800ms of inactivity
- Rapid changes don't trigger multiple saves (debounced)
- `lastSaved` updates in projectStore

**Test composition:**
- `tests/unit/hooks/useAutoSave.test.ts`:
  - `it('triggers save after debounce period')`
  - `it('does not save during rapid changes')`
  - `it('updates lastSaved timestamp')`

#### 2.5 UI Store (Beta)
- [ ] Implement `uiStore` with Zustand:
  - `activePanel: 'palette' | 'properties' | null`
  - `theme: 'light' | 'dark' | 'system'`
  - `isExporting: boolean`
  - `isCommandPaletteOpen: boolean`
  - Toggle actions for each
- [ ] Implement `projectStore`:
  - `project: FlowProject` (metadata portion)
  - `setProjectName(name)`, `setDomain(domain)`

**Acceptance criteria:**
- Panel toggles update state correctly
- Theme state persists (read by UI layer)
- Project name is editable via store

**Test composition:**
- `tests/unit/stores/uiStore.test.ts`:
  - `it('toggles active panel')`
  - `it('switches theme')`
  - `it('opens and closes command palette')`
- `tests/unit/stores/projectStore.test.ts`:
  - `it('sets project name')`
  - `it('sets project domain')`

---

### Sprint 3: Editing UX (5 days)

> **Goal:** Full editing workflow — add, connect, select, delete, undo, export.  
> **Teams active:** Gamma, Beta, Delta — **in parallel**

#### 3.1 Node Palette (Gamma)
- [ ] Implement `NodePalette.tsx`:
  - Accordion groups: "Terminals" (Start/End), "Process" (Task), "Logic" (Decision), "Annotation" (Note)
  - Each item shows icon + label
- [ ] Implement `DraggableNodeItem.tsx`:
  - Sets `dataTransfer` with node type on drag start
- [ ] Handle drop on `FlowCanvas`:
  - Read node type from drop event
  - Create node via `nodeFactory` at drop position

**Acceptance criteria:**
- Palette shows all 5 node types in categorized groups
- Dragging an item from palette to canvas creates the node
- Node appears at the correct drop position

**Test composition:**
- `tests/unit/components/panels/NodePalette.test.tsx`:
  - `it('renders all node categories')`
  - `it('renders all node items within categories')`
  - `it('sets transfer data on drag start')`

#### 3.2 Property Panel (Gamma)
- [ ] Implement `PropertyPanel.tsx`:
  - Shows node properties when a node is selected
  - Shows edge properties when an edge is selected
  - Shows empty/help state when nothing selected
- [ ] Implement `NodeProperties.tsx`:
  - Editable fields: label, description, color picker
  - Changes write to flowStore immediately
- [ ] Implement `EdgeProperties.tsx`:
  - Editable: label, edge type dropdown

**Acceptance criteria:**
- Selecting a node shows its properties in the panel
- Editing label updates the node in real time
- Selecting nothing shows help text

**Test composition:**
- `it('shows node properties when node is selected')`
- `it('shows empty state when nothing selected')`
- `it('updates node label on input change')`

#### 3.3 Toolbar (Gamma)
- [ ] Implement `Toolbar.tsx`:
  - Left: project name (editable)
  - Center: undo / redo buttons (disabled states)
  - Right: export dropdown, zoom indicator
- [ ] Implement `ProjectName.tsx`:
  - Click to edit inline, Enter to confirm

**Acceptance criteria:**
- Undo/redo buttons reflect `canUndo`/`canRedo` state
- Clicking project name allows editing
- Export dropdown opens export panel

**Test composition:**
- `it('disables undo button when canUndo is false')`
- `it('enables redo button when canRedo is true')`
- `it('allows editing project name')`

#### 3.4 Keyboard Shortcuts (Beta)
- [ ] Implement `useKeyboardShortcuts()`:
  - `Ctrl+Z` → undo
  - `Ctrl+Shift+Z` / `Ctrl+Y` → redo
  - `Delete` / `Backspace` → delete selected
  - `Ctrl+A` → select all
  - `Ctrl+C` / `Ctrl+V` → copy/paste nodes (clone with offset)
  - `Escape` → deselect all

**Acceptance criteria:**
- Each shortcut triggers the correct store action
- Shortcuts don't fire when typing in input fields
- Copy creates a new node with offset position

**Test composition:**
- `tests/unit/hooks/useKeyboardShortcuts.test.ts`:
  - `it('triggers undo on Ctrl+Z')`
  - `it('triggers delete on Delete key')`
  - `it('does not trigger when input is focused')`
  - `it('copies and pastes selected nodes')`

#### 3.5 PNG/SVG Export (Delta)
- [ ] Implement `toImage.toPng(element, options)`:
  - Use `html-to-image` `toPng()` on the React Flow viewport
  - Support 2x DPI option
- [ ] Implement `toImage.toSvg(element, options)`:
  - Use `html-to-image` `toSvg()`
- [ ] Implement `ExportPanel.tsx`:
  - Format selector: JSON, PNG, SVG
  - "Download" button triggers export + `file-saver` download

**Acceptance criteria:**
- PNG export produces a Blob with correct MIME type
- SVG export produces valid SVG markup
- Download triggers browser save dialog
- Export panel shows format options

**Test composition:**
- `tests/unit/lib/export/toImage.test.ts`:
  - `it('exports canvas to PNG blob')`
  - `it('exports canvas to SVG blob')`
  - `it('supports 2x DPI option')`

---

### Sprint 4: Integration & Polish (4 days)

> **Goal:** Wire everything together, achieve Phase 1 completeness.  
> **Teams active:** All — **converge for integration**

#### 4.1 App Shell (Integration)
- [ ] Implement `App.tsx`:
  - Layout: Toolbar (top) → Palette (left) + Canvas (center) + PropertyPanel (right)
  - Wire `useKeyboardShortcuts()` at root
  - Wire `useAutoSave()` at root
  - Load project from IndexedDB on mount
- [ ] Implement responsive sidebar collapse for smaller viewports
- [ ] Add loading state / skeleton for initial project load

**Acceptance criteria:**
- App renders complete layout with all panels
- Auto-save persists across browser refresh
- Keyboard shortcuts work globally
- No console errors or warnings

**Test composition:**
- `tests/e2e/basicFlow.spec.ts`:
  - `it('loads the app and shows empty canvas')`
  - `it('adds a node from palette via drag and drop')`
  - `it('connects two nodes with an edge')`
  - `it('deletes a selected node')`
  - `it('undoes a delete')`
  - `it('exports to JSON and re-imports')`
  - `it('persists flow across page reload')`

#### 4.2 Validation (Beta)
- [ ] Implement `flowValidator.validateFlow(nodes, edges)`:
  - Check: at least one start node
  - Check: orphan nodes (nodes with zero connections)
  - Check: unreachable nodes from start
  - Return `ValidationResult { valid, warnings[], errors[] }`
- [ ] Display validation warnings in toolbar (icon badge)

**Acceptance criteria:**
- Validator detects orphan and unreachable nodes
- Validation runs on demand (toolbar button)
- Results shown non-intrusively

**Test composition:**
- `tests/unit/lib/validation/flowValidator.test.ts`:
  - `it('valid flow with start→task→end passes')`
  - `it('flow without start node returns error')`
  - `it('orphan node returns warning')`
  - `it('unreachable node returns warning')`

---

## 4. Sprint Plan — Phase 2 (Enhanced Editing, v0.2)

### Sprint 5: Multi-Select & Grouping (5 days)

> **Teams active:** Beta, Gamma — **in parallel**

#### 5.1 Multi-Select (Beta)
- [ ] Extend `flowStore`:
  - `selectedNodeIds: string[]` → support Set-like add/remove
  - Shift+click adds to selection
  - Rubber-band selection (drag rectangle)
- [ ] Implement `selectAll()` and `deselectAll()` actions

**Acceptance criteria:**
- Shift+click adds nodes to selection
- Rubber-band selects all enclosed nodes
- Ctrl+A selects all, Escape deselects

**Test composition:**
- `it('adds node to selection on shift+click')`
- `it('rubber-band selects enclosed nodes')`
- `it('selectAll selects all nodes')`

#### 5.2 Grouping (Gamma)
- [ ] Implement `GroupNode` component:
  - Container node that visually groups child nodes
  - Resizable border, custom label
  - Moving group moves all children
- [ ] Update node palette with "Group" item

**Acceptance criteria:**
- User can create a group around selected nodes
- Moving a group moves child nodes
- Group is visually distinct (dashed container border)

**Test composition:**
- `it('creates a group containing selected nodes')`
- `it('moving group moves children')`

#### 5.3 Copy/Paste Enhancement (Beta)
- [ ] Deep-clone selected nodes with new IDs (via factory)
- [ ] Re-map internal edges (edges between copied nodes)
- [ ] Paste with +20px offset to avoid overlap

**Acceptance criteria:**
- Copied nodes get new unique IDs
- Internal edges between copied nodes are preserved
- Pasted nodes don't overlap originals

**Test composition:**
- `it('clones nodes with new IDs via factory')`
- `it('preserves internal edges between cloned nodes')`
- `it('offsets pasted nodes by 20px')`

---

### Sprint 6: Export Formats & Theming (5 days)

> **Teams active:** Delta, Gamma — **in parallel**

#### 6.1 Mermaid Export (Delta)
- [ ] Implement `toMermaid.ts`:
  - Map node types to Mermaid shapes (rounded, diamond, stadium, etc.)
  - Map edges to arrow styles (`-->`, `-.->`, `==>`)
  - Generate valid `flowchart TD` syntax
- [ ] Add "Mermaid" option to ExportPanel

**Acceptance criteria:**
- Mermaid output renders correctly in Mermaid Live Editor
- All 5 node types map to appropriate shapes
- Edge labels are preserved

**Test composition:**
- `it('generates valid Mermaid flowchart syntax')`
- `it('maps process nodes to rounded rectangles')`
- `it('maps decision nodes to diamonds')`
- `it('includes edge labels')`

#### 6.2 Theme System (Gamma)
- [ ] Implement light/dark/system theme via CSS custom properties:
  - `--bg-canvas`, `--bg-panel`, `--bg-node`, `--text-primary`, etc.
- [ ] Theme toggle in toolbar
- [ ] Persist theme preference in localStorage

**Acceptance criteria:**
- Switching theme updates all component colors
- System theme follows OS preference
- Theme persists across page reload

**Test composition:**
- `it('switches to dark theme')`
- `it('persists theme to localStorage')`

---

## 5. Sprint Plan — Phase 3 (Templates & Domains, v0.3)

### Sprint 7: Domain Node Sets (5 days)

> **Teams active:** Gamma, Epsilon — **in parallel**

#### 7.1 Domain-Specific Node Components (Gamma)
- [ ] Implement `ApiNode.tsx`:
  - Hexagon shape, HTTP method badge (GET/POST/PUT/DELETE)
  - Fields: method, path, description
- [ ] Implement `DatabaseNode.tsx`:
  - Cylinder shape, label + engine badge
- [ ] Implement `ServiceNode.tsx`:
  - Rounded rectangle with service icon
- [ ] Implement `EntityNode.tsx`:
  - Rectangle with field list (for ER diagrams)
- [ ] Update node palette to group by domain

**Acceptance criteria:**
- Each domain node has a distinct visual shape
- Domain nodes compose BaseNode (no duplication)
- Palette groups domain nodes under domain headers

**Test composition:**
- `it('ApiNode renders hexagon with method badge')`
- `it('DatabaseNode renders cylinder shape')`
- `it('EntityNode renders field list')`

#### 7.2 Domain Palette Switching (Epsilon)
- [ ] Implement domain selector in NodePalette:
  - Dropdown: General, Admin, Research, API, Data, System
  - Switching domain filters visible node types per feature matrix
- [ ] Store active domain in `projectStore`

**Acceptance criteria:**
- Selecting "API" domain shows only API-relevant nodes
- Selecting "General" shows core nodes only
- Domain persists with project

**Test composition:**
- `it('filters palette to admin nodes when admin domain selected')`
- `it('shows all core nodes in general domain')`

---

### Sprint 8: Templates (5 days)

> **Teams active:** Epsilon, Delta — **in parallel**

#### 8.1 Template Implementations (Epsilon)
- [ ] Implement `approvalWorkflow.ts`:
  - Start → Submit Form → Manager Review → Decision(Approved?) → [Yes→End, No→Revise→loop back]
- [ ] Implement `experimentPipeline.ts`:
  - Start → Hypothesis → Design → Collect Data → Analyze → Decision(Significant?) → Publish/Revise
- [ ] Implement `restApiFlow.ts`:
  - Client → Auth Check → Route → Controller → Service → DB → Response
- [ ] Implement `erDiagram.ts`:
  - User ↔ Post ↔ Comment (sample entities with relationships)
- [ ] Implement `cicdPipeline.ts`:
  - Push → Build → Unit Test → Integration Test → Stage → Deploy

**Acceptance criteria:**
- Each template produces a valid `FlowProject`
- All nodes reference defined types
- All edges reference existing node IDs
- Templates render correctly on canvas

**Test composition:**
- `tests/unit/templates/templates.test.ts`:
  - `it('approvalWorkflow has Start and End nodes')`
  - `it('approvalWorkflow has all edges referencing valid nodes')`
  - `it('experimentPipeline has Decision node')`
  - Repeat for each template

#### 8.2 Template Selector UI (Epsilon + Gamma)
- [ ] Implement "New from Template" dialog:
  - Grid of template cards with preview thumbnail
  - Grouped by domain
  - Click loads template into canvas
- [ ] Add "New from Template" button to toolbar

**Acceptance criteria:**
- Dialog shows all available templates
- Clicking a template loads it onto the canvas
- Existing unsaved work prompts confirmation before overwrite

**Test composition:**
- `it('displays template cards grouped by domain')`
- `it('loads selected template onto canvas')`

---

### Sprint 9: Navigation & Polish (4 days)

> **Teams active:** Gamma, Beta, Integration — **converge**

#### 9.1 Minimap (Gamma)
- [ ] Implement `CanvasMinimap.tsx`:
  - Color-coded by node type
  - Click-to-navigate viewport

**Acceptance criteria:**
- Minimap shows all nodes in their relative positions
- Clicking minimap pans the canvas

#### 9.2 Snap-to-Grid (Beta)
- [ ] Add `snapToGrid` and `snapGrid` to `flowStore` / React Flow options
- [ ] Toggle in project settings

**Acceptance criteria:**
- Nodes snap to configurable grid when enabled
- Disabling allows free placement

#### 9.3 Phase 3 E2E Suite (Integration)
- [ ] E2E: Load a domain, create nodes from palette, connect them, export
- [ ] E2E: Load a template, modify it, export
- [ ] E2E: Switch between domains

**Test composition:**
- `tests/e2e/domainFlow.spec.ts`
- `tests/e2e/templateFlow.spec.ts`

---

## 6. Parallel Execution Timeline

```
Week │ Sprint │ Alpha     │ Beta        │ Gamma        │ Delta       │ Epsilon
─────┼────────┼───────────┼─────────────┼──────────────┼─────────────┼──────────
  1  │  S0    │ Types     │ (blocked)   │ (blocked)    │ (blocked)   │ (blocked)
     │        │ contracts │             │              │             │
─────┼────────┼───────────┼─────────────┼──────────────┼─────────────┼──────────
  2  │  S1    │ Review    │ flowStore   │ FlowCanvas   │ JSON        │ (waiting)
     │        │           │ Factories   │ Controls     │ IndexedDB   │
─────┼────────┼───────────┼─────────────┼──────────────┼─────────────┼──────────
  3  │  S2    │ (done)    │ uiStore     │ BaseNode     │ useAutoSave │ (waiting)
     │        │           │ projectSto. │ All 5 nodes  │             │
     │        │           │             │ 2 edges      │             │
─────┼────────┼───────────┼─────────────┼──────────────┼─────────────┼──────────
  4  │  S3    │           │ Keyboard    │ Palette      │ PNG/SVG     │
     │        │           │ shortcuts   │ PropPanel    │ ExportPanel │
     │        │           │             │ Toolbar      │             │
─────┼────────┼───────────┼─────────────┼──────────────┼─────────────┼──────────
  5  │  S4    │           │ Validation  │ App shell    │ Integration │
     │        │           │             │ assembly     │ testing     │
─────┼────────┼───────────┼─────────────┼──────────────┼─────────────┼──────────
     │        │           │ ─── PHASE 1 COMPLETE (v0.1) ────────────│──────────
─────┼────────┼───────────┼─────────────┼──────────────┼─────────────┼──────────
  6  │  S5    │           │ MultiSelect │ GroupNode    │             │
     │        │           │ Copy/Paste  │              │             │
─────┼────────┼───────────┼─────────────┼──────────────┼─────────────┼──────────
  7  │  S6    │           │             │ Themes       │ Mermaid     │
     │        │           │             │              │ export      │
─────┼────────┼───────────┼─────────────┼──────────────┼─────────────┼──────────
     │        │           │ ─── PHASE 2 COMPLETE (v0.2) ────────────│──────────
─────┼────────┼───────────┼─────────────┼──────────────┼─────────────┼──────────
  8  │  S7    │           │             │ Domain nodes │             │ Domain
     │        │           │             │ (API, DB,    │             │ palette
     │        │           │             │  Entity)     │             │ switching
─────┼────────┼───────────┼─────────────┼──────────────┼─────────────┼──────────
  9  │  S8    │           │             │ Template UI  │             │ Template
     │        │           │             │              │             │ impls
─────┼────────┼───────────┼─────────────┼──────────────┼─────────────┼──────────
 10  │  S9    │           │ Snap-grid   │ Minimap      │             │ E2E
     │        │           │             │              │             │ tests
─────┼────────┼───────────┼─────────────┼──────────────┼─────────────┼──────────
     │        │           │ ─── PHASE 3 COMPLETE (v0.3) ────────────│──────────
```

---

## 7. File → Team Ownership Map (Quick Reference)

```
src/
├── app/                        → Integration
├── types/                      → Alpha
├── stores/                     → Beta
├── hooks/
│   ├── useFlowStore.ts         → Beta
│   ├── useUndoRedo.ts          → Beta
│   ├── useKeyboardShortcuts.ts → Gamma (consumes Beta actions)
│   └── useAutoSave.ts          → Delta
├── components/
│   ├── canvas/                 → Gamma
│   ├── nodes/                  → Gamma (core) + Epsilon (domain-specific)
│   ├── edges/                  → Gamma
│   ├── panels/
│   │   ├── node-palette/       → Gamma
│   │   ├── property-panel/     → Gamma
│   │   └── export-panel/       → Delta
│   ├── toolbar/                → Gamma
│   ├── command-palette/        → Gamma
│   └── ui/                     → Gamma
├── lib/
│   ├── export/                 → Delta
│   ├── import/                 → Delta
│   ├── persistence/            → Delta
│   ├── validation/             → Beta
│   └── factories/              → Beta
├── templates/                  → Epsilon
└── styles/                     → Integration
```

---

*Sprint Plan Version: 1.0*  
*Last Updated: 2026-02-20*
