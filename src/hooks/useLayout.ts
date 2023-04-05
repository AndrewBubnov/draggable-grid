import { useLayoutEffect, useRef } from 'react';
import { DragStatus } from '../types';
import { getInitialLayout } from '../utils/getInitialLayout';
import { GAP, COLUMN_SPAN, TEMPLATE_COLUMNS, TEMPLATE_ROWS, ROW_SPAN } from '../constants';
import { getComputedParam } from '../utils/getComputedParam';
import { useStore } from '../store';

export const useLayout = () => {
	const {
		layout,
		setLayout,
		setStartLayout,
		startLayout,
		recalculateLayout,
		rowHeight,
		setRowHeight,
		columnWidth,
		setColumnWidth,
		tiles,
		setTiles,
	} = useStore();

	const ref = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (!ref.current) return;
		const childCoords = Array.from(ref.current?.children || []).map(child => {
			const computed = getComputedStyle(child);
			const computedWidth = computed.getPropertyValue(COLUMN_SPAN);
			const computedHeight = computed.getPropertyValue(ROW_SPAN);
			return {
				id: child.id,
				coords: child.getBoundingClientRect(),
				width: getComputedParam(computedWidth),
				height: getComputedParam(computedHeight),
			};
		});
		const initLayout = getInitialLayout(childCoords);
		setStartLayout(initLayout);
		setLayout(initLayout);
	}, []);

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
	}, []);

	const dragHandlers = (element: string, status: DragStatus) => {
		if (status === DragStatus.CANCEL) {
			setTiles({ start: '', end: '' });
		}
		if (status === DragStatus.START) {
			setTiles({ ...tiles, start: element });
		}
		if (status === DragStatus.END && tiles.start !== element) {
			setTiles({ ...tiles, end: element });
		}
		const { start, end } = tiles;
		if (start && end) recalculateLayout(start, end);
	};

	return { layout, startLayout, dragHandlers, columnWidth, rowHeight, ref };
};
