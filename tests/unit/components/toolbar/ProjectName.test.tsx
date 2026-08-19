import React from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ProjectName } from '@/components/toolbar/ProjectName';
import { useProjectStore } from '@/stores/projectStore';
import { createProject } from '@/lib/factories/projectFactory';

describe('ProjectName', () => {
	beforeEach(() => {
		useProjectStore.setState({ project: null, lastSaved: null });
	});

	it('shows fallback name when project is not set', () => {
		render(<ProjectName />);
		expect(screen.getByRole('button', { name: 'Edit project name' })).toHaveTextContent('Untitled Project');
	});

	it('renames project on Enter', () => {
		useProjectStore.setState({ project: createProject('Before Rename'), lastSaved: null });
		render(<ProjectName />);

		fireEvent.click(screen.getByRole('button', { name: 'Edit project name' }));
		const input = screen.getByRole('textbox', { name: 'Project name' });
		fireEvent.change(input, { target: { value: 'After Rename' } });
		fireEvent.keyDown(input, { key: 'Enter' });

		expect(useProjectStore.getState().project?.name).toBe('After Rename');
		expect(screen.getByRole('button', { name: 'Edit project name' })).toHaveTextContent('After Rename');
	});

	it('cancels rename on Escape', () => {
		useProjectStore.setState({ project: createProject('Original Name'), lastSaved: null });
		render(<ProjectName />);

		fireEvent.click(screen.getByRole('button', { name: 'Edit project name' }));
		const input = screen.getByRole('textbox', { name: 'Project name' });
		fireEvent.change(input, { target: { value: 'Should Not Save' } });
		fireEvent.keyDown(input, { key: 'Escape' });

		expect(useProjectStore.getState().project?.name).toBe('Original Name');
		expect(screen.getByRole('button', { name: 'Edit project name' })).toHaveTextContent('Original Name');
	});
});
