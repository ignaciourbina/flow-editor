import { describe, expect, it } from 'vitest';
import { CORE_NODE_TYPES, DOMAIN_NODE_TYPES, isNodeType } from '@/types';

describe('types/nodes', () => {
	it('accepts valid node types', () => {
		expect(isNodeType('start')).toBe(true);
		expect(isNodeType('apiEndpoint')).toBe(true);
	});

	it('rejects invalid node types', () => {
		expect(isNodeType('unknown-type')).toBe(false);
		expect(isNodeType('')).toBe(false);
	});

	it('exports expected core and domain node type collections', () => {
		expect(CORE_NODE_TYPES).toContain('process');
		expect(DOMAIN_NODE_TYPES).toContain('entity');
		expect(CORE_NODE_TYPES.length).toBeGreaterThan(0);
		expect(DOMAIN_NODE_TYPES.length).toBeGreaterThan(0);
	});
});
