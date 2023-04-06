import { create } from './utils/jaunte';
import { Layout } from './types';

interface UseStore {
	layout: Layout;
	startLayout: Layout;
	columnWidth: number;
	rowHeight: number;
	storedConfig: Layout | null;
	setStoredConfig: (arg: Layout) => void;
	setColumnWidth: (arg: number) => void;
	setRowHeight: (arg: number) => void;
	setLayout: (arg: Layout) => void;
	setStartLayout: (arg: Layout) => void;
	resetConfig: () => void;
}

export const [useStore, { resetConfig }] = create<UseStore>(set => ({
	layout: {},
	startLayout: {},
	columnWidth: 0,
	rowHeight: 0,
	storedConfig: null,
	setStoredConfig: (arg: Layout) => set({ storedConfig: arg }),
	setColumnWidth: (arg: number) => set({ columnWidth: arg }),
	setRowHeight: (arg: number) => set({ rowHeight: arg }),
	setLayout: (arg: Layout) => set(() => ({ layout: arg })),
	setStartLayout: (arg: Layout) => set(() => ({ startLayout: arg })),
	resetConfig: () => set(state => ({ layout: state.storedConfig ? state.storedConfig : state.startLayout })),
}));
