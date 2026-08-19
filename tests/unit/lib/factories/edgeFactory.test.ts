import { describe, expect, it } from 'vitest';
import { createEdge } from '@/lib/factories/edgeFactory';

describe('edgeFactory', () => {
	it('createEdge generates unique id', () => {
		const a = createEdge('n1', 'n2');
		const b = createEdge('n1', 'n3');
		expect(a.id).toMatch(/^e_/);
		expect(b.id).toMatch(/^e_/);
		expect(a.id).not.toBe(b.id);
	});

	it('sets source and target', () => {
		const edge = createEdge('source-node', 'target-node');
		expect(edge.source).toBe('source-node');
		expect(edge.target).toBe('target-node');
	});

	it('defaults to default type', () => {
		const edge = createEdge('n1', 'n2');
		expect(edge.type).toBe('default');
	});
});
