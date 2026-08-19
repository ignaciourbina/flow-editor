import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@xyflow/react', () => ({
	Position: { Top: 'top', Bottom: 'bottom', Left: 'left', Right: 'right' },
	Handle: ({ type }: { type: string }) => <div data-testid={`handle-${type}`} />,
}));

import { BaseNode } from '@/components/nodes/BaseNode';

describe('BaseNode', () => {
	it('renders label', () => {
		render(<BaseNode label="My Node" />);
		expect(screen.getByText('My Node')).toBeInTheDocument();
	});

	it('renders default source and target handles', () => {
		render(<BaseNode label="Handles" />);
		expect(screen.getAllByTestId('handle-target')).toHaveLength(1);
		expect(screen.getAllByTestId('handle-source')).toHaveLength(1);
	});

	it('applies selected ring styling', () => {
		const { container } = render(<BaseNode label="Selected" selected />);
		expect(container.firstElementChild?.className).toContain('ring-2');
	});

	it('renders children content', () => {
		render(
			<BaseNode label="With Child">
				<div>Child content</div>
			</BaseNode>,
		);
		expect(screen.getByText('Child content')).toBeInTheDocument();
	});

	it('renders custom handles and source label', () => {
		render(
			<BaseNode
				label="Custom"
				targetHandles={[{ position: 'left' as never, id: 't1' }]}
				sourceHandles={[{ position: 'right' as never, id: 's1', label: 'Yes' }]}
			/>,
		);
		expect(screen.getAllByTestId('handle-target')).toHaveLength(1);
		expect(screen.getAllByTestId('handle-source')).toHaveLength(1);
		expect(screen.getByText('Yes')).toBeInTheDocument();
	});
});
