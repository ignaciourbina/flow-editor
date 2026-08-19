import { describe, expect, it } from 'vitest';
import { createNode, getDefaultNodeData } from '@/lib/factories/nodeFactory';

describe('nodeFactory', () => {
	it('createNode generates unique ids', () => {
		const a = createNode('process', { x: 0, y: 0 });
		const b = createNode('process', { x: 0, y: 0 });
		expect(a.id).toMatch(/^n_/);
		expect(b.id).toMatch(/^n_/);
		expect(a.id).not.toBe(b.id);
	});

	it('applies defaults by node type', () => {
		const start = createNode('start', { x: 1, y: 2 });
		const defaults = getDefaultNodeData('start');
		expect(start.type).toBe('start');
		expect(start.data.label).toBe(defaults.label);
		expect(start.data.variant).toBe('start');
	});

	it('accepts position and data overrides', () => {
		const node = createNode('process', { x: 10, y: 20 }, { label: 'Custom' });
		expect(node.position).toEqual({ x: 10, y: 20 });
		expect(node.data.label).toBe('Custom');
	});
});
