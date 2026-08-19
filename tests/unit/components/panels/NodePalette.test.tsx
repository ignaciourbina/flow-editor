import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { NodePalette } from '@/components/panels/node-palette/NodePalette';

describe('NodePalette', () => {
	it('renders node categories and items', () => {
		render(<NodePalette />);
		expect(screen.getByText('Terminals')).toBeInTheDocument();
		expect(screen.getAllByText('Process').length).toBeGreaterThan(0);
		expect(screen.getByText('Logic')).toBeInTheDocument();
		expect(screen.getByText('Annotation')).toBeInTheDocument();
		expect(screen.getByText('Start')).toBeInTheDocument();
	});

	it('drag start sets transfer data for node type', () => {
		render(<NodePalette />);
		const startItem = screen.getByTitle('Drag to add a Start node');

		const setData = vi.fn();
		const dataTransfer = {
			setData,
			effectAllowed: 'none',
		} as unknown as DataTransfer;

		fireEvent.dragStart(startItem, { dataTransfer });
		expect(setData).toHaveBeenCalledWith('application/flow-editor-node', 'start');
	});
});
