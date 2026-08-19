import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@xyflow/react', () => ({
	Position: { Top: 'top', Bottom: 'bottom', Left: 'left', Right: 'right' },
	Handle: ({ type }: { type: string }) => <div data-testid={`handle-${type}`} />,
}));

import NoteNode from '@/components/nodes/NoteNode';

describe('NoteNode', () => {
	it('renders note label and body', () => {
		render(
			<NoteNode
				data={{ label: 'Sticky', body: 'Remember this', connectable: false } as never}
				selected={false}
				id="note-1"
				type="note"
				xPos={0}
				yPos={0}
				zIndex={1}
				isConnectable
				dragging={false}
				deletable
				selectable
				draggable
			/>,
		);

		expect(screen.getByText('Sticky')).toBeInTheDocument();
		expect(screen.getByText('Remember this')).toBeInTheDocument();
	});

	it('does not show handles by default', () => {
		render(
			<NoteNode
				data={{ label: 'No handles', connectable: false } as never}
				selected={false}
				id="note-2"
				type="note"
				xPos={0}
				yPos={0}
				zIndex={1}
				isConnectable
				dragging={false}
				deletable
				selectable
				draggable
			/>,
		);

		expect(screen.queryByTestId('handle-source')).not.toBeInTheDocument();
		expect(screen.queryByTestId('handle-target')).not.toBeInTheDocument();
	});

	it('shows one source and one target handle when connectable is true', () => {
		render(
			<NoteNode
				data={{ label: 'Connectable', connectable: true } as never}
				selected
				id="note-3"
				type="note"
				xPos={0}
				yPos={0}
				zIndex={1}
				isConnectable
				dragging={false}
				deletable
				selectable
				draggable
			/>,
		);

		expect(screen.getAllByTestId('handle-source')).toHaveLength(1);
		expect(screen.getAllByTestId('handle-target')).toHaveLength(1);
	});
});
