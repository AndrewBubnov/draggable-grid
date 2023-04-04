import { useLayoutEffect, useRef, useState } from 'react';
import { Layout, DragStatus, Tiles } from '../types';
import { getInitialChildrenStyle } from '../utils/getInitialChildrenStyle';
import { GAP, COLUMN_SPAN, TEMPLATE_COLUMNS, TEMPLATE_ROWS, ROW_SPAN } from '../constants';
import { recalculatePositions } from '../utils/recalculatePositions';
import { getComputedParam } from '../utils/getComputedParam';

export const useLayout = () => {
	const [layout, setLayout] = useState<Layout>({} as Layout);
	const [columnWidth, setColumnWidth] = useState<number>(0);
	const [rowHeight, setRowHeight] = useState<number>(0);

	const startLayout = useRef<Layout>({} as Layout);
	const tiles = useRef<Tiles>({ start: '', end: '' });
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
		const initLayout = getInitialChildrenStyle(childCoords);
		startLayout.current = initLayout;
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
			tiles.current = { start: '', end: '' };
		}
		if (status === DragStatus.START) {
			tiles.current = { ...tiles.current, start: element };
		}
		if (status === DragStatus.END && tiles.current.start !== element) {
			tiles.current = { ...tiles.current, end: element };
		}
		const { start, end } = tiles.current;
		if (start && end) setLayout(prevState => recalculatePositions(prevState, start, end));
	};

	return { layout, startLayout: startLayout.current, dragHandlers, columnWidth, rowHeight, ref };
};
