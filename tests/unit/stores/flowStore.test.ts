import { beforeEach, describe, expect, it } from 'vitest';
import { useFlowStore } from '@/stores/flowStore';

function makeNode(id: string, type: 'start' | 'process' | 'end' = 'process') {
	return {
		id,
		type,
		position: { x: 0, y: 0 },
		data: {
			label: id,
			...(type === 'start' || type === 'end' ? { variant: type } : {}),
		},
	};
}

function makeEdge(id: string, source: string, target: string) {
	return { id, source, target, type: 'default', data: {} };
}

describe('flowStore', () => {
	beforeEach(() => {
		useFlowStore.setState({
			nodes: [],
			edges: [],
			selectedNodeIds: [],
			selectedEdgeIds: [],
			past: [],
			future: [],
		});
	});

	it('addNode inserts node into state', () => {
		useFlowStore.getState().addNode(makeNode('n1'));
		expect(useFlowStore.getState().nodes).toHaveLength(1);
		expect(useFlowStore.getState().nodes[0]?.id).toBe('n1');
	});

	it('removeNode removes node and connected edges', () => {
		useFlowStore.setState({
			nodes: [makeNode('a', 'start'), makeNode('b'), makeNode('c', 'end')],
			edges: [makeEdge('e1', 'a', 'b'), makeEdge('e2', 'b', 'c')],
		});

		useFlowStore.getState().removeNode('b');

		expect(useFlowStore.getState().nodes.map((n) => n.id)).toEqual(['a', 'c']);
		expect(useFlowStore.getState().edges).toHaveLength(0);
	});

	it('updateNodeData merges node data', () => {
		useFlowStore.setState({ nodes: [makeNode('n1')] });
		useFlowStore.getState().updateNodeData('n1', { description: 'desc' });

		const updated = useFlowStore.getState().nodes[0];
		expect(updated?.data.label).toBe('n1');
		expect(updated?.data.description).toBe('desc');
	});

	it('setSelection updates selected node and edge ids', () => {
		useFlowStore.getState().setSelection(['n1', 'n2'], ['e1']);
		expect(useFlowStore.getState().selectedNodeIds).toEqual(['n1', 'n2']);
		expect(useFlowStore.getState().selectedEdgeIds).toEqual(['e1']);
	});

	it('undo restores previous state and redo reapplies it', () => {
		useFlowStore.getState().addNode(makeNode('n1'));
		useFlowStore.getState().addNode(makeNode('n2'));

		expect(useFlowStore.getState().nodes).toHaveLength(2);
		useFlowStore.getState().undo();
		expect(useFlowStore.getState().nodes).toHaveLength(1);

		useFlowStore.getState().redo();
		expect(useFlowStore.getState().nodes).toHaveLength(2);
	});
});
