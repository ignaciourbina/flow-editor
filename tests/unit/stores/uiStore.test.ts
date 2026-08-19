import { beforeEach, describe, expect, it } from 'vitest';
import { useUiStore } from '@/stores/uiStore';

describe('uiStore', () => {
	beforeEach(() => {
		useUiStore.setState({
			activePanel: null,
			theme: 'system',
			isCommandPaletteOpen: false,
			isExporting: false,
		});
	});

	it('toggles panel open/close', () => {
		useUiStore.getState().togglePanel('export');
		expect(useUiStore.getState().activePanel).toBe('export');

		useUiStore.getState().togglePanel('export');
		expect(useUiStore.getState().activePanel).toBeNull();
	});

	it('switches theme', () => {
		useUiStore.getState().setTheme('dark');
		expect(useUiStore.getState().theme).toBe('dark');
	});

	it('opens and closes command palette', () => {
		useUiStore.getState().openCommandPalette();
		expect(useUiStore.getState().isCommandPaletteOpen).toBe(true);

		useUiStore.getState().closeCommandPalette();
		expect(useUiStore.getState().isCommandPaletteOpen).toBe(false);
	});
});
