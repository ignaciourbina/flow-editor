import { describe, expect, it } from 'vitest';
import { validateFlow } from '@/lib/validation/flowValidator';

function node(id: string, type: 'start' | 'process' | 'end' = 'process') {
	return {
		id,
		type,
		position: { x: 0, y: 0 },
		data: { label: id, ...(type === 'start' || type === 'end' ? { variant: type } : {}) },
	};
}

function edge(id: string, source: string, target: string) {
	return { id, source, target, type: 'default', data: {} };
}

describe('flowValidator', () => {
	it('passes a valid simple flow', () => {
		const result = validateFlow(
			[node('s', 'start'), node('p'), node('e', 'end')] as never,
			[edge('e1', 's', 'p'), edge('e2', 'p', 'e')] as never,
		);

		expect(result.valid).toBe(true);
		expect(result.errors).toHaveLength(0);
	});

	it('detects orphan nodes', () => {
		const result = validateFlow(
			[node('s', 'start'), node('p'), node('e', 'end')] as never,
			[edge('e1', 's', 'e')] as never,
		);

		expect(result.warnings.some((w) => w.code === 'ORPHAN_NODE')).toBe(true);
	});

	it('detects disconnected edge references', () => {
		const result = validateFlow(
			[node('s', 'start'), node('e', 'end')] as never,
			[edge('bad', 's', 'missing')] as never,
		);

		expect(result.valid).toBe(false);
		expect(result.errors.some((e) => e.code === 'DISCONNECTED_EDGE')).toBe(true);
	});
});
