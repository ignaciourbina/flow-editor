import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createProject } from '@/lib/factories/projectFactory';

vi.mock('idb-keyval', () => {
	const store = new Map<string, string>();
	return {
		set: async (key: string, value: string) => {
			store.set(key, value);
		},
		get: async (key: string) => store.get(key),
		del: async (key: string) => {
			store.delete(key);
		},
		keys: async () => Array.from(store.keys()),
		__reset: () => store.clear(),
	};
});

import { saveProject, loadProject, deleteProject, listProjects } from '@/lib/persistence/indexedDb';
import * as idbKeyval from 'idb-keyval';

describe('indexedDb persistence', () => {
	beforeEach(() => {
		(idbKeyval as unknown as { __reset: () => void }).__reset();
	});

	it('saveProject and loadProject round-trip', async () => {
		const project = createProject('A', 'general');
		await saveProject(project);
		const loaded = await loadProject(project.id);

		expect(loaded?.id).toBe(project.id);
		expect(loaded?.name).toBe('A');
	});

	it('listProjects returns summaries', async () => {
		const a = createProject('A', 'general');
		const b = createProject('B', 'admin');
		await saveProject(a);
		await saveProject(b);

		const list = await listProjects();
		expect(list.length).toBe(2);
		expect(list.some((item) => item.name === 'A')).toBe(true);
		expect(list.some((item) => item.name === 'B')).toBe(true);
	});

	it('deleteProject removes data', async () => {
		const project = createProject('Delete Me', 'general');
		await saveProject(project);
		await deleteProject(project.id);

		const loaded = await loadProject(project.id);
		expect(loaded).toBeNull();
	});
});
