import { useLayoutEffect, useRef, useState } from 'react';
import { Child, DragStatus } from '../types';
import { getInitialChildrenStyle } from '../utils/getInitialChildrenStyle';
import { AUTO, GAP, SPAN, TEMPLATE_COLUMNS, TEMPLATE_ROWS } from '../constants';

export const useLayout = () => {
	const [layout, setLayout] = useState<Child>({} as Child);
	const [columnWidth, setColumnWidth] = useState<number>(0);
	const [rowHeight, setRowHeight] = useState<number>(0);

	const startLayout = useRef<Child>({} as Child);
	const tiles = useRef<{ start: string | ''; end: string | '' }>({ start: '', end: '' });
	const ref = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (!ref.current) return;
		const childCoords = Array.from(ref.current?.children || []).map(child => {
			const computedWidth = getComputedStyle(child).getPropertyValue(SPAN);
			return {
				id: child.id,
				coords: child.getBoundingClientRect(),
				width: computedWidth === AUTO ? 1 : +computedWidth.split(' ')[1],
			};
		});
		const initLayout = getInitialChildrenStyle(childCoords) as Child;
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
		if (start && end)
			setLayout(prevState => {
				const { [start]: startElement, [end]: endElement } = prevState;
				return {
					...prevState,
					[start]: endElement,
					[end]: startElement,
				};
			});
	};

	return { layout, startLayout: startLayout.current, dragHandlers, columnWidth, rowHeight, ref };
};
