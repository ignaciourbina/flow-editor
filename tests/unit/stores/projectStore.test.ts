import { beforeEach, describe, expect, it } from 'vitest';
import { useProjectStore } from '@/stores/projectStore';
import { createProject } from '@/lib/factories/projectFactory';

describe('projectStore', () => {
	beforeEach(() => {
		useProjectStore.setState({ project: null, lastSaved: null });
	});

	it('setProject stores the provided project', () => {
		const project = createProject('My Project', 'general');
		useProjectStore.getState().setProject(project);

		expect(useProjectStore.getState().project?.name).toBe('My Project');
		expect(useProjectStore.getState().project?.domain).toBe('general');
	});

	it('setProjectName updates name and timestamp', () => {
		const project = createProject('Before', 'admin');
		useProjectStore.getState().setProject(project);

		const oldUpdatedAt = useProjectStore.getState().project?.updatedAt;
		useProjectStore.getState().setProjectName('After');
		const updated = useProjectStore.getState().project;

		expect(updated?.name).toBe('After');
		expect(updated?.updatedAt).toBeTypeOf('string');
		expect(Date.parse(updated?.updatedAt ?? '')).toBeGreaterThanOrEqual(Date.parse(oldUpdatedAt ?? ''));
	});

	it('records lastSaved timestamp', () => {
		useProjectStore.getState().setLastSaved('2026-01-01T00:00:00.000Z');
		expect(useProjectStore.getState().lastSaved).toBe('2026-01-01T00:00:00.000Z');
	});
});
