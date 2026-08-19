import React from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Toolbar } from '@/components/toolbar/Toolbar';
import { useProjectStore } from '@/stores/projectStore';
import { useFlowStore } from '@/stores/flowStore';
import { useUiStore } from '@/stores/uiStore';
import { createProject } from '@/lib/factories/projectFactory';

describe('Toolbar', () => {
	beforeEach(() => {
		localStorage.clear();
		useProjectStore.setState({ project: createProject('Toolbar Project'), lastSaved: null });
		useFlowStore.setState({
			nodes: [],
			edges: [],
			selectedNodeIds: [],
			selectedEdgeIds: [],
			past: [],
			future: [],
		});
		useUiStore.setState({
			activePanel: null,
			theme: 'system',
			isCommandPaletteOpen: false,
			isExporting: false,
			showCanvasGrid: true,
			canvasGridStyle: 'dots',
			canvasBackgroundColor: 'grey',
			isSettingsOpen: false,
		});
	});

	it('renders project name', () => {
		render(<Toolbar />);
		expect(screen.getByText('Toolbar Project')).toBeInTheDocument();
	});

	it('disables undo button when no history exists', () => {
		render(<Toolbar />);
		expect(screen.getByRole('button', { name: 'Undo' })).toBeDisabled();
	});

	it('opens export panel when export button is clicked', () => {
		render(<Toolbar />);
		fireEvent.click(screen.getByRole('button', { name: 'Export' }));
		expect(useUiStore.getState().activePanel).toBe('export');
	});

	it('cycles theme from system to light', () => {
		render(<Toolbar />);
		fireEvent.click(screen.getByRole('button', { name: 'Theme: system' }));
		expect(useUiStore.getState().theme).toBe('light');
	});

	it('opens settings dialog from toolbar button', () => {
		render(<Toolbar />);
		fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
		expect(useUiStore.getState().isSettingsOpen).toBe(true);
	});

	it('opens command palette from toolbar button', () => {
		render(<Toolbar />);
		fireEvent.click(screen.getByRole('button', { name: 'Open command palette' }));
		expect(useUiStore.getState().isCommandPaletteOpen).toBe(true);
	});
});
