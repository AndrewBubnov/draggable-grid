import { create } from './utils/jaunte';
import { Layout, Tiles } from './types';
import { recalculatePositions } from './utils/recalculatePositions';

interface UseStore {
	layout: Layout;
	startLayout: Layout;
	columnWidth: number;
	rowHeight: number;
	tiles: Tiles;
	setTiles: (arg: Tiles) => void;
	setColumnWidth: (arg: number) => void;
	setRowHeight: (arg: number) => void;
	setLayout: (arg: Layout) => void;
	setStartLayout: (arg: Layout) => void;
	recalculateLayout: (start: string, end: string) => void;
	resetLayout: () => void;
}

export const [useStore, { resetLayout }] = create<UseStore>(set => ({
	layout: {},
	startLayout: {},
	columnWidth: 0,
	rowHeight: 0,
	setColumnWidth: (arg: number) => set({ columnWidth: arg }),
	setRowHeight: (arg: number) => set({ rowHeight: arg }),
	tiles: { start: '', end: '' },
	setTiles: (arg: Tiles) => set({ tiles: arg }),
	setLayout: (arg: Layout) => set(() => ({ layout: arg })),
	setStartLayout: (arg: Layout) => set(() => ({ startLayout: arg })),
	recalculateLayout: (start: string, end: string) =>
		set(state => ({ layout: recalculatePositions(state.layout, start, end) })),
	resetLayout: () => set(state => ({ layout: state.startLayout })),
}));
