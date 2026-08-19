import { describe, expect, it } from 'vitest';
import { fromJson, ImportError } from '@/lib/import/fromJson';

describe('fromJson', () => {
	it('parses valid json', () => {
		const raw = JSON.stringify({
			id: 'p1',
			name: 'Import Project',
			domain: 'general',
			flow: {
				nodes: [{ id: 'n1', type: 'start', position: { x: 0, y: 0 }, data: { label: 'Start', variant: 'start' } }],
				edges: [],
			},
		});

		const project = fromJson(raw);
		expect(project.id).toBe('p1');
		expect(project.name).toBe('Import Project');
	});

	it('rejects invalid schema', () => {
		const raw = JSON.stringify({ id: 'p1', name: 'Broken', flow: { nodes: [], edges: [] } });
		expect(() => fromJson(raw)).toThrow(ImportError);
	});

	it('fills defaults for missing optional fields', () => {
		const raw = JSON.stringify({
			id: 'p1',
			name: 'Defaults',
			domain: 'general',
			flow: { nodes: [], edges: [] },
		});

		const project = fromJson(raw);
		expect(project.settings.gridSize).toBe(15);
		expect(project.flow.viewport).toEqual({ x: 0, y: 0, zoom: 1 });
	});
});
