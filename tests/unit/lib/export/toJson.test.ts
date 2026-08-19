import { describe, expect, it } from 'vitest';
import { toJson } from '@/lib/export/toJson';
import { fromJson } from '@/lib/import/fromJson';
import { createProject } from '@/lib/factories/projectFactory';

describe('toJson', () => {
	it('produces valid json string', () => {
		const project = createProject('Export Test');
		const json = toJson(project);
		expect(() => JSON.parse(json)).not.toThrow();
	});

	it('includes schemaVersion', () => {
		const project = createProject('Version Test');
		project.schemaVersion = undefined as unknown as number;
		const parsed = JSON.parse(toJson(project));
		expect(parsed.schemaVersion).toBeTypeOf('number');
	});

	it('round-trips with fromJson', () => {
		const project = createProject('Roundtrip');
		project.flow.nodes = [
			{ id: 'n1', type: 'start', position: { x: 0, y: 0 }, data: { label: 'Start', variant: 'start' } },
		] as typeof project.flow.nodes;

		const reimported = fromJson(toJson(project));
		expect(reimported.name).toBe('Roundtrip');
		expect(reimported.flow.nodes).toHaveLength(1);
		expect(reimported.flow.nodes[0]?.id).toBe('n1');
	});
});
