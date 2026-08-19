import { describe, expect, it } from 'vitest';
import { templates } from '@/templates';

describe('templates', () => {
	it('each template returns a valid project-like shape', () => {
		for (const template of templates) {
			const project = template.factory();
			expect(project.id).toBeTypeOf('string');
			expect(project.name).toBeTypeOf('string');
			expect(project.domain).toBe(template.domain);
			expect(Array.isArray(project.flow.nodes)).toBe(true);
			expect(Array.isArray(project.flow.edges)).toBe(true);
			expect(project.flow.nodes.length).toBeGreaterThan(0);
		}
	});

	it('all template edges reference existing node ids', () => {
		for (const template of templates) {
			const project = template.factory();
			const ids = new Set(project.flow.nodes.map((node) => node.id));
			for (const edge of project.flow.edges) {
				expect(ids.has(edge.source)).toBe(true);
				expect(ids.has(edge.target)).toBe(true);
			}
		}
	});

	it('non-data templates include at least one start and one end node', () => {
		for (const template of templates.filter((t) => t.domain !== 'data')) {
			const project = template.factory();
			const types = project.flow.nodes.map((node) => node.type);
			expect(types).toContain('start');
			expect(types).toContain('end');
		}
	});
});
