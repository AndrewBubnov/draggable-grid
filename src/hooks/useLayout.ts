import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { DragStatus, Layout } from '../types';
import { getInitLayout } from '../utils/getInitLayout';
import { GAP, TEMPLATE_COLUMNS, TEMPLATE_ROWS, TRANSITION_DURATION } from '../constants';
import { useStore } from '../store';
import { recalculatePositions } from '../utils/recalculatePositions';
import { getChildrenCoords } from '../utils/getChildrenCoords';

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

	const [startId, setStartId] = useState<string>('');
	const [endId, setEndId] = useState<string>('');

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
		if (config && Object.keys(config).length) {
			setLayout(config);
			setStoredConfig(config);
		}
	}, [config, setLayout, setStoredConfig]);

	const updateIds = useCallback((id: string, status: DragStatus) => {
		if (!reorderAllowed.current) return;
		if (status === DragStatus.START) setStartId(id);
		if (status === DragStatus.END) setEndId(id);
		if (status === DragStatus.CANCEL) {
			setStartId('');
			setEndId('');
		}
	}, []);

	useLayoutEffect(() => {
		if (!reorderAllowed.current) return;

		if (startId && endId && startId !== endId) {
			reorderAllowed.current = false;
			const newLayout = recalculatePositions(layout, startId, endId);
			setLayout(newLayout);
			if (updateConfig) updateConfig(newLayout);
			setTimeout(() => {
				reorderAllowed.current = true;
			}, TRANSITION_DURATION);
		}
	}, [endId, layout, setLayout, startId, updateConfig]);

	return { layout, startLayout, columnWidth, rowHeight, ref, updateIds };
};
