import { useCallback, useLayoutEffect, useRef } from 'react';
import { DragStatus, Layout } from '../types';
import { getInitLayout } from '../utils/getInitLayout';
import { GAP, TEMPLATE_COLUMNS, TEMPLATE_ROWS } from '../constants';
import { useStore } from '../store';
import { recalculatePositions } from '../utils/recalculatePositions';
import { getChildrenCoords } from '../utils/getChildrenCoords';
import { delayedRefSwitch } from '../utils/delayedRefSwitch';

export const useLayout = (config?: Layout, updateConfig?: (arg: Layout) => void) => {
	const {
		layout,
		setLayout,
		setStartLayout,
		startLayout,
		rowHeight,
		setRowHeight,
		columnWidth,
		setColumnWidth,
		setStoredConfig,
	} = useStore();

	const startId = useRef<string>('');
	const ref = useRef<HTMLDivElement>(null);
	const reorderAllowed = useRef(true);

	useLayoutEffect(() => {
		if (!ref.current) return;
		const childCoords = getChildrenCoords(ref.current);
		const initLayout = getInitLayout(childCoords);
		setStartLayout(initLayout);
		setLayout(initLayout);
	}, [setLayout, setStartLayout]);

	useLayoutEffect(() => {
		if (!ref.current) return;
		const { current } = ref;

		const resizeCallback = () => {
			const computed = getComputedStyle(current);
			const gap = parseFloat(computed.getPropertyValue(GAP));
			const column = parseFloat(computed.getPropertyValue(TEMPLATE_COLUMNS));
			const row = parseFloat(computed.getPropertyValue(TEMPLATE_ROWS));
			setColumnWidth(column + gap);
			setRowHeight(row + gap);
		};

		const observer = new ResizeObserver(resizeCallback);
		observer.observe(current);

		return () => observer.unobserve(current);
	}, [setColumnWidth, setRowHeight]);

	useLayoutEffect(() => {
		if (!config || !Object.keys(config).length) return;
		setLayout(config);
		setStoredConfig(config);
	}, [config, setLayout, setStoredConfig]);

	const updateIds = useCallback(
		(id: string, status: DragStatus) => {
			if (!reorderAllowed.current) return;
			if (status === DragStatus.START) {
				startId.current = id;
			}
			if (status === DragStatus.END) {
				if (startId && startId.current !== id) {
					reorderAllowed.current = false;
					const newLayout = recalculatePositions(layout, startId.current, id);
					setLayout(newLayout);
					if (updateConfig) updateConfig(newLayout);
					delayedRefSwitch(reorderAllowed).then();
				}
			}
			if (status === DragStatus.CANCEL) {
				startId.current = '';
			}
		},
		[layout, setLayout, startId, updateConfig]
	);

	return { layout, startLayout, columnWidth, rowHeight, ref, updateIds };
};
