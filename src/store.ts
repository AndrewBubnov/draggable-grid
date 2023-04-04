import { create } from './utils/jaunte';
import { Layout } from './types';
import { recalculatePositions } from './utils/recalculatePositions';

interface UseStore {
	layout: Layout;
	startLayout: Layout;
	setLayout: (arg: Layout) => void;
	setStartLayout: (arg: Layout) => void;
	recalculateLayout: (start: string, end: string) => void;
	reset: () => void;
}

export const [useStore, layoutState] = create<UseStore>(set => ({
	layout: {},
	startLayout: {},
	setLayout: (arg: Layout) => set(() => ({ layout: arg })),
	setStartLayout: (arg: Layout) => set(() => ({ startLayout: arg })),
	recalculateLayout: (start: string, end: string) =>
		set(state => ({ layout: recalculatePositions(state.layout, start, end) })),
	reset: () => set(state => ({ layout: state.startLayout })),
}));
