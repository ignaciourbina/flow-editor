# Flow Editor - Technical Blueprint

> A flexible, extensible process diagram designer for visualizing workflows, system architectures, data models, and research processes.

---

## 1. Overview

### 1.1 Purpose
Flow Editor is a web-based diagramming tool designed to create, edit, and export process flows for multiple domains:
- **Administrative processes** (approval workflows, onboarding)
- **Research stages** (experiment pipelines, literature review flows)
- **Data models** (entity relationships, data pipelines)
- **API models** (endpoint flows, request/response chains)
- **System flows** (architecture diagrams, deployment pipelines)

### 1.2 Key Goals
- Intuitive drag-and-drop interface
- Multiple node types per domain
- Export to JSON, PNG, SVG, and Mermaid syntax
- Local-first with optional cloud sync
- Extensible plugin architecture

### 1.3 Key Pain Points to Address

Existing diagramming tools have common frustrations this project aims to solve:

| Pain Point | Problem | Our Solution |
|------------|---------|--------------|
| **Vendor Lock-in** | Proprietary formats (Lucidchart, Visio) trap your data | JSON-first storage, multiple export formats, open schema |
| **Offline Limitations** | Cloud-only tools fail without internet | Local-first IndexedDB, works 100% offline |
| **Overwhelming Complexity** | Enterprise tools have steep learning curves (draw.io, Visio) | Minimal UI, progressive disclosure, domain-focused palettes |
| **Poor Node Semantics** | Generic shapes lack meaning for specific domains | Domain-specific node types with built-in semantics |
| **No Keyboard Navigation** | Mouse-heavy workflows slow power users | Full keyboard shortcuts, command palette (Cmd+K) |
| **Context Switching** | Different tools for different diagram types | Multi-domain support in one tool with switchable palettes |
| **Version Control Unfriendly** | Binary or complex XML formats don't diff well | Clean JSON format, git-friendly structure |
| **Slow Performance** | Canvas lags with 50+ nodes | React Flow's virtualized rendering, optimized re-renders |
| **Export Quality** | Blurry exports, broken layouts | High-DPI PNG, true vector SVG, semantic Mermaid |
| **Lost Work** | No auto-save, crash = lost progress | Aggressive auto-save (debounced), undo history persisted |
| **Collaboration Friction** | Sharing requires accounts, subscriptions | Export/import JSON, shareable URLs (no account for basic use) |
| **Template Scarcity** | Starting from blank canvas every time | Domain templates, reusable patterns library |

### 1.4 Feature Matrix by Domain

| Feature | Admin Processes | Research Stages | Data Models | API Models | System Flows |
|---------|:---------------:|:---------------:|:-----------:|:----------:|:------------:|
| **Core Nodes** | | | | | |
| Start/End nodes | ✅ | ✅ | ○ | ✅ | ✅ |
| Task/Process nodes | ✅ | ✅ | ○ | ✅ | ✅ |
| Decision/Gateway | ✅ | ✅ | ○ | ✅ | ✅ |
| Data I/O nodes | ○ | ✅ | ✅ | ✅ | ✅ |
| **Domain-Specific Nodes** | | | | | |
| Approval node | ✅ | ○ | ○ | ○ | ○ |
| Person/Role node | ✅ | ✅ | ○ | ○ | ○ |
| Document node | ✅ | ✅ | ○ | ○ | ○ |
| Experiment node | ○ | ✅ | ○ | ○ | ○ |
| Hypothesis node | ○ | ✅ | ○ | ○ | ○ |
| Analysis node | ○ | ✅ | ✅ | ○ | ○ |
| Entity node | ○ | ○ | ✅ | ○ | ○ |
| Relationship node | ○ | ○ | ✅ | ○ | ○ |
| Database node | ○ | ○ | ✅ | ✅ | ✅ |
| API Endpoint node | ○ | ○ | ○ | ✅ | ✅ |
| Request/Response node | ○ | ○ | ○ | ✅ | ○ |
| Auth/Token node | ○ | ○ | ○ | ✅ | ✅ |
| Service node | ○ | ○ | ○ | ✅ | ✅ |
| Server/Container node | ○ | ○ | ○ | ○ | ✅ |
| Queue/Event node | ○ | ○ | ○ | ✅ | ✅ |
| **Edge Types** | | | | | |
| Sequential flow | ✅ | ✅ | ○ | ✅ | ✅ |
| Conditional branch | ✅ | ✅ | ○ | ✅ | ✅ |
| Data flow | ○ | ✅ | ✅ | ✅ | ✅ |
| Relationship (1:1, 1:N, N:M) | ○ | ○ | ✅ | ○ | ○ |
| Async/Event | ○ | ○ | ○ | ✅ | ✅ |
| **Templates** | | | | | |
| Approval workflow | ✅ | ○ | ○ | ○ | ○ |
| Onboarding flow | ✅ | ○ | ○ | ○ | ○ |
| Experiment pipeline | ○ | ✅ | ○ | ○ | ○ |
| Literature review | ○ | ✅ | ○ | ○ | ○ |
| ER diagram | ○ | ○ | ✅ | ○ | ○ |
| Data pipeline | ○ | ○ | ✅ | ○ | ✅ |
| REST API flow | ○ | ○ | ○ | ✅ | ○ |
| Auth flow (OAuth) | ○ | ○ | ○ | ✅ | ○ |
| Microservices arch | ○ | ○ | ○ | ○ | ✅ |
| CI/CD pipeline | ○ | ○ | ○ | ○ | ✅ |
| **Export Formats** | | | | | |
| JSON | ✅ | ✅ | ✅ | ✅ | ✅ |
| PNG/SVG | ✅ | ✅ | ✅ | ✅ | ✅ |
| Mermaid flowchart | ✅ | ✅ | ○ | ✅ | ✅ |
| Mermaid ER diagram | ○ | ○ | ✅ | ○ | ○ |
| OpenAPI (future) | ○ | ○ | ○ | ✅ | ○ |

**Legend:** ✅ = Primary use case | ○ = Supported but secondary

---

## 2. Technology Stack

### 2.1 Core Framework
| Layer | Technology | Rationale |
|-------|------------|-----------|
| **UI Framework** | React 18+ | Component-based, large ecosystem |
| **Language** | TypeScript 5+ | Type safety, better DX, refactoring support |
| **Build Tool** | Vite | Fast HMR, modern ESM support |
| **State Management** | Zustand | Lightweight, TypeScript-friendly, no boilerplate |

### 2.2 Diagram Engine
| Package | Version | Purpose |
|---------|---------|---------|
| **@xyflow/react** (React Flow v12+) | ^12.x | Core diagram rendering, node/edge management |
| **@xyflow/minimap** | ^12.x | Minimap navigation |
| **@xyflow/controls** | ^12.x | Zoom/pan controls |
| **@xyflow/background** | ^12.x | Grid/dot backgrounds |

### 2.3 UI Components
| Package | Purpose |
|---------|---------|
| **Tailwind CSS 3+** | Utility-first styling |
| **Radix UI** | Accessible primitives (dialogs, dropdowns, tooltips) |
| **Lucide React** | Icon library |
| **cmdk** | Command palette (Cmd+K) |

### 2.4 Persistence & Export
| Package | Purpose |
|---------|---------|
| **idb-keyval** | IndexedDB wrapper for local storage |
| **html-to-image** | PNG/SVG export |
| **file-saver** | Download handling |

### 2.5 Development Tools
| Tool | Purpose |
|------|---------|
| **Vitest** | Unit testing |
| **Playwright** | E2E testing |
| **ESLint + Prettier** | Code quality |
| **Storybook** | Component documentation |

---

## 3. Architecture

### 3.1 Directory Structure
```
flow-editor/
├── public/
│   └── icons/
├── src/
│   ├── app/                    # App shell, routing
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── components/
│   │   ├── canvas/             # React Flow wrapper, viewport
│   │   │   ├── FlowCanvas.tsx
│   │   │   ├── CanvasControls.tsx
│   │   │   └── Minimap.tsx
│   │   ├── nodes/              # Custom node types
│   │   │   ├── BaseNode.tsx
│   │   │   ├── ProcessNode.tsx
│   │   │   ├── DecisionNode.tsx
│   │   │   ├── DataNode.tsx
│   │   │   ├── ApiNode.tsx
│   │   │   └── index.ts
│   │   ├── edges/              # Custom edge types
│   │   │   ├── DefaultEdge.tsx
│   │   │   ├── ConditionalEdge.tsx
│   │   │   └── index.ts
│   │   ├── panels/             # Side panels
│   │   │   ├── NodePalette.tsx
│   │   │   ├── PropertyPanel.tsx
│   │   │   └── ExportPanel.tsx
│   │   ├── toolbar/            # Top toolbar
│   │   │   └── Toolbar.tsx
│   │   └── ui/                 # Shared UI primitives
│   ├── hooks/                  # Custom React hooks
│   │   ├── useFlowStore.ts
│   │   ├── useUndoRedo.ts
│   │   ├── useKeyboardShortcuts.ts
│   │   └── useAutoSave.ts
│   ├── stores/                 # Zustand stores
│   │   ├── flowStore.ts        # Nodes, edges, viewport
│   │   ├── uiStore.ts          # Panels, modals, theme
│   │   └── projectStore.ts     # Project metadata
│   ├── lib/                    # Utilities
│   │   ├── export/
│   │   │   ├── toJson.ts
│   │   │   ├── toImage.ts
│   │   │   └── toMermaid.ts
│   │   ├── import/
│   │   │   └── fromJson.ts
│   │   ├── persistence/
│   │   │   └── indexedDb.ts
│   │   └── validation/
│   │       └── flowValidator.ts
│   ├── types/                  # TypeScript definitions
│   │   ├── nodes.ts
│   │   ├── edges.ts
│   │   ├── project.ts
│   │   └── index.ts
│   ├── templates/              # Pre-built flow templates
│   │   ├── adminWorkflow.ts
│   │   ├── researchPipeline.ts
│   │   └── apiFlow.ts
│   └── styles/
│       └── globals.css
├── tests/
│   ├── unit/
│   └── e2e/
├── .storybook/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

### 3.2 State Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Zustand Stores                       │
├─────────────────┬─────────────────┬─────────────────────┤
│   flowStore     │    uiStore      │   projectStore      │
│  ─────────────  │  ─────────────  │  ─────────────────  │
│  • nodes[]      │  • activePanel  │  • projectId        │
│  • edges[]      │  • theme        │  • name             │
│  • viewport     │  • isExporting  │  • lastSaved        │
│  • selectedIds  │  • commandOpen  │  • metadata         │
│  • history[]    │                 │                     │
└─────────────────┴─────────────────┴─────────────────────┘
         │                 │                  │
         └─────────────────┴──────────────────┘
                           │
                    ┌──────▼──────┐
                    │  IndexedDB  │
                    │  Persistence│
                    └─────────────┘
```

### 3.3 Component Hierarchy

```
App
├── Toolbar
│   ├── ProjectName
│   ├── UndoRedo
│   ├── ZoomControls
│   └── ExportMenu
├── MainLayout
│   ├── NodePalette (left sidebar)
│   │   ├── CategoryAccordion
│   │   └── DraggableNodeItem[]
│   ├── FlowCanvas (center)
│   │   ├── ReactFlowProvider
│   │   ├── CustomNodes
│   │   ├── CustomEdges
│   │   ├── Minimap
│   │   └── Background
│   └── PropertyPanel (right sidebar)
│       ├── NodeProperties
│       └── EdgeProperties
└── CommandPalette (overlay)
```

---

## 4. Node Type System

### 4.1 Base Node Interface

```typescript
interface BaseNodeData {
  label: string;
  description?: string;
  color?: string;
  icon?: string;
  metadata?: Record<string, unknown>;
}

interface FlowNode<T extends BaseNodeData = BaseNodeData> {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: T;
  selected?: boolean;
  dragging?: boolean;
}
```

### 4.2 Domain-Specific Node Types

| Category | Node Types | Visual Style |
|----------|------------|--------------|
| **Process** | Start, End, Task, Subprocess | Rounded rectangles |
| **Decision** | Condition, Switch, Gateway | Diamonds |
| **Data** | Input, Output, Database, File | Parallelograms |
| **API** | Request, Response, Webhook, Auth | Hexagons |
| **Annotation** | Note, Comment, Group | Dashed borders |

### 4.3 Edge Types

| Type | Purpose | Visual |
|------|---------|--------|
| **Default** | Standard flow | Solid arrow |
| **Conditional** | Yes/No branches | Labeled |
| **Data** | Data transfer | Dashed |
| **Async** | Async operations | Dotted |

---

## 5. Feature Roadmap

### Phase 1: MVP (v0.1)
- [ ] Basic canvas with pan/zoom
- [ ] 5 core node types (Start, End, Task, Decision, Note)
- [ ] Default edge connections
- [ ] JSON export/import
- [ ] Local storage persistence
- [ ] Undo/Redo (10 steps)

### Phase 2: Enhanced Editing (v0.2)
- [ ] Node palette with drag-and-drop
- [ ] Property panel for node editing
- [ ] Multi-select and grouping
- [ ] Copy/paste nodes
- [ ] PNG/SVG export
- [ ] Keyboard shortcuts

### Phase 3: Templates & Domains (v0.3)
- [ ] Domain-specific node sets (Admin, Research, API, Data)
- [ ] Pre-built templates
- [ ] Custom color themes
- [ ] Minimap navigation
- [ ] Snap-to-grid

### Phase 4: Advanced Features (v0.4)
- [ ] Command palette (Cmd+K)
- [ ] Mermaid syntax export
- [ ] Validation (connected flows)
- [ ] Search nodes
- [ ] Version history

### Phase 5: Collaboration (v0.5)
- [ ] Project sharing via URL/JSON
- [ ] Optional cloud sync (Supabase/Firebase)
- [ ] Real-time collaboration (CRDT)

---

## 6. Extension Points

### 6.1 Custom Node Registry

```typescript
// Register custom nodes
nodeRegistry.register('customNode', {
  component: CustomNodeComponent,
  icon: 'custom-icon',
  category: 'custom',
  defaultData: { label: 'Custom' },
  schema: CustomNodeSchema, // Zod validation
});
```

### 6.2 Plugin Architecture

```typescript
interface FlowEditorPlugin {
  name: string;
  version: string;
  
  // Lifecycle hooks
  onInit?: (editor: FlowEditor) => void;
  onNodeCreate?: (node: FlowNode) => FlowNode;
  onExport?: (data: ExportData) => ExportData;
  
  // UI extensions
  toolbarItems?: ToolbarItem[];
  panelExtensions?: PanelExtension[];
  nodeTypes?: NodeTypeDefinition[];
}
```

### 6.3 Export Format Plugins

```typescript
// Add custom export formats
exportRegistry.register('plantuml', {
  name: 'PlantUML',
  extension: '.puml',
  mimeType: 'text/plain',
  transform: (flow) => convertToPlantUML(flow),
});
```

---

## 7. Data Model

### 7.1 Project Schema

```typescript
interface FlowProject {
  id: string;
  name: string;
  description?: string;
  domain: 'general' | 'admin' | 'research' | 'api' | 'data';
  createdAt: string;
  updatedAt: string;
  
  flow: {
    nodes: FlowNode[];
    edges: FlowEdge[];
    viewport: { x: number; y: number; zoom: number };
  };
  
  settings: {
    snapToGrid: boolean;
    gridSize: number;
    showMinimap: boolean;
    theme: 'light' | 'dark' | 'system';
  };
}
```

### 7.2 Storage Strategy

| Storage | Purpose | Sync |
|---------|---------|------|
| **IndexedDB** | Primary local storage | Debounced auto-save |
| **LocalStorage** | User preferences only | Immediate |
| **File System** | Manual export/import | On demand |
| **Cloud (optional)** | Cross-device sync | On auth |

---

## 8. Dependencies Summary

### 8.1 package.json (Planned)

```json
{
  "name": "flow-editor",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:e2e": "playwright test",
    "storybook": "storybook dev -p 6006",
    "lint": "eslint src --ext ts,tsx"
  },
  "dependencies": {
    "@radix-ui/react-dialog": "^1.x",
    "@radix-ui/react-dropdown-menu": "^2.x",
    "@radix-ui/react-tooltip": "^1.x",
    "@xyflow/react": "^12.x",
    "cmdk": "^1.x",
    "file-saver": "^2.x",
    "html-to-image": "^1.x",
    "idb-keyval": "^6.x",
    "lucide-react": "^0.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "zustand": "^4.x"
  },
  "devDependencies": {
    "@playwright/test": "^1.x",
    "@storybook/react-vite": "^8.x",
    "@types/file-saver": "^2.x",
    "@types/react": "^18.x",
    "@types/react-dom": "^18.x",
    "@typescript-eslint/eslint-plugin": "^7.x",
    "@vitejs/plugin-react": "^4.x",
    "autoprefixer": "^10.x",
    "eslint": "^8.x",
    "postcss": "^8.x",
    "prettier": "^3.x",
    "tailwindcss": "^3.x",
    "typescript": "^5.x",
    "vite": "^5.x",
    "vitest": "^1.x"
  }
}
```

---

## 9. Design Decisions

### 9.1 Why React Flow?
- **Active maintenance**: 20k+ stars, frequent releases
- **TypeScript-first**: Excellent type definitions
- **Extensible**: Custom nodes/edges are first-class
- **Performance**: Virtualized rendering for large graphs
- **MIT License**: No commercial restrictions

### 9.2 Why Zustand over Redux/Context?
- Minimal boilerplate
- Built-in TypeScript inference
- Easy undo/redo with middleware
- No provider nesting required

### 9.3 Why IndexedDB over LocalStorage?
- Larger storage limits (GBs vs 5MB)
- Structured data support
- Non-blocking async API
- Better for complex project data

### 9.4 Local-First Approach
- Works offline by default
- User owns their data
- Optional sync is additive
- No account required to start

---

## 10. Getting Started (Post-Implementation)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

---

## 11. References

- [React Flow Documentation](https://reactflow.dev/docs)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

*Blueprint Version: 1.0*  
*Last Updated: 2026-02-20*
