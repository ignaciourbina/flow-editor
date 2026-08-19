import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { useFlowStore } from '@/stores/flowStore';

vi.mock('@xyflow/react', () => ({
	ReactFlowProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
	ReactFlow: ({ children, onDrop, onDragOver, onEdgeContextMenu, onNodeContextMenu, edges, nodes }: Record<string, unknown>) => (
		<div
			data-testid="react-flow"
			onDrop={onDrop as React.DragEventHandler}
			onDragOver={onDragOver as React.DragEventHandler}
		>
			<button
				data-testid="mock-edge-context"
				onContextMenu={(event) => {
					const firstEdge = Array.isArray(edges) ? edges[0] : undefined;
					if (firstEdge && onEdgeContextMenu) {
						(onEdgeContextMenu as (e: React.MouseEvent, edge: { id: string }) => void)(event, firstEdge as { id: string });
					}
				}}
			/>
			<button
				data-testid="mock-node-context"
				onContextMenu={(event) => {
					const firstNode = Array.isArray(nodes) ? nodes[0] : undefined;
					if (firstNode && onNodeContextMenu) {
						(onNodeContextMenu as (e: React.MouseEvent, node: { id: string; type: string }) => void)(
							event,
							firstNode as { id: string; type: string },
						);
					}
				}}
			/>
			{children as React.ReactNode}
		</div>
	),
	useReactFlow: () => ({
		screenToFlowPosition: ({ x, y }: { x: number; y: number }) => ({ x, y }),
	}),
	Background: () => <div data-testid="canvas-background" />,
	Controls: () => <div data-testid="canvas-controls" />,
	MiniMap: () => <div data-testid="canvas-minimap" />,
	BackgroundVariant: {
		Dots: 'dots',
		Lines: 'lines',
		Cross: 'cross',
	},
	Position: {
		Top: 'top',
		Bottom: 'bottom',
		Left: 'left',
		Right: 'right',
	},
}));

vi.mock('@/components/nodes', () => ({ nodeTypes: {} }));
vi.mock('@/components/edges', () => ({ edgeTypes: {} }));

import { FlowCanvas } from '@/components/canvas/FlowCanvas';

describe('FlowCanvas', () => {
	beforeEach(() => {
		useFlowStore.setState({
			nodes: [],
			edges: [],
			selectedNodeIds: [],
			selectedEdgeIds: [],
			past: [],
			future: [],
		});
	});

	it('renders canvas with empty state', () => {
		render(<FlowCanvas />);
		expect(screen.getByTestId('react-flow')).toBeInTheDocument();
	});

	it('handles drop event and adds a node', () => {
		render(<FlowCanvas />);
		const canvas = screen.getByTestId('react-flow');

		const dataTransfer = {
			getData: vi.fn((key: string) => (key === 'application/reactflow' ? 'start' : '')),
			dropEffect: 'none',
		} as unknown as DataTransfer;

		fireEvent.drop(canvas, { dataTransfer, clientX: 50, clientY: 100 });
		expect(useFlowStore.getState().nodes).toHaveLength(1);
		expect(useFlowStore.getState().nodes[0]?.type).toBe('start');
	});

	it('adds node from context menu at click position', () => {
		render(<FlowCanvas />);
		const canvas = screen.getByTestId('react-flow');

		fireEvent.contextMenu(canvas, { clientX: 120, clientY: 240 });
		expect(screen.getByRole('menu', { name: 'Add node menu' })).toBeInTheDocument();

		fireEvent.click(screen.getByRole('menuitem', { name: 'Process' }));

		expect(useFlowStore.getState().nodes).toHaveLength(1);
		expect(useFlowStore.getState().nodes[0]?.type).toBe('process');
		expect(useFlowStore.getState().nodes[0]?.position).toEqual({ x: 120, y: 240 });
	});

	it('updates edge end marker from edge context menu', () => {
		useFlowStore.setState({
			nodes: [
				{ id: 'n1', type: 'start', position: { x: 0, y: 0 }, data: { label: 'Start', variant: 'start' } },
				{ id: 'n2', type: 'end', position: { x: 50, y: 50 }, data: { label: 'End', variant: 'end' } },
			],
			edges: [{ id: 'e1', source: 'n1', target: 'n2', type: 'default', data: {} }],
		});

		render(<FlowCanvas />);
		const edgeTrigger = screen.getByTestId('mock-edge-context');

		fireEvent.contextMenu(edgeTrigger, { clientX: 60, clientY: 60 });
		expect(screen.getByRole('menu', { name: 'Edit edge menu' })).toBeInTheDocument();

		fireEvent.click(screen.getByRole('menuitem', { name: 'None' }));
		expect(useFlowStore.getState().edges[0]?.markerEnd).toBeUndefined();
	});

	it('edits note content from modal opened in node context menu', () => {
		useFlowStore.setState({
			nodes: [
				{ id: 'note-1', type: 'note', position: { x: 0, y: 0 }, data: { label: 'Old', body: 'Old body' } },
			],
			edges: [],
		});

		render(<FlowCanvas />);
		const nodeTrigger = screen.getByTestId('mock-node-context');
		fireEvent.contextMenu(nodeTrigger, { clientX: 90, clientY: 90 });

		fireEvent.click(screen.getByRole('menuitem', { name: 'Edit note content' }));
		fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated title' } });
		fireEvent.change(screen.getByLabelText('Body'), { target: { value: 'Updated body' } });
		fireEvent.click(screen.getByRole('button', { name: 'Save' }));

		expect(useFlowStore.getState().nodes[0]?.data.label).toBe('Updated title');
		expect(useFlowStore.getState().nodes[0]?.data.body).toBe('Updated body');
	});
});
