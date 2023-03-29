import { useLayoutEffect, useRef, useState } from 'react';
import { ChildrenStyle, DragStatus } from '../types';
import { getInitialChildrenStyle } from '../utils/getInitialChildrenStyle';

export const useLayout = () => {
	const [layout, setLayout] = useState<ChildrenStyle>({} as ChildrenStyle);
	const [startLayout, setStartLayout] = useState<ChildrenStyle>({} as ChildrenStyle);
	const [columnWidth, setColumnWidth] = useState<number>(0);
	const [rowHeight, setRowHeight] = useState<number>(0);

	const ref = useRef<HTMLDivElement>(null);
	const tiles = useRef<{ start: string | ''; end: string | '' }>({ start: '', end: '' });

	useLayoutEffect(() => {
		if (!ref.current) return;
		const { current } = ref;

		const resizeCallback = () => {
			const childCoords = Array.from(current?.children || []).map(child => ({
				id: child.id,
				coords: child.getBoundingClientRect(),
			}));
			const { style, width, height } = getInitialChildrenStyle(childCoords);
			setStartLayout(style as ChildrenStyle);
			setColumnWidth(width);
			setRowHeight(height);
		};

		const observer = new ResizeObserver(resizeCallback);
		observer.observe(current);

		return () => observer.unobserve(current);
	}, []);

	useLayoutEffect(
		() => setLayout(prevState => (Object.keys(prevState).length ? prevState : startLayout)),
		[startLayout]
	);

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

	return { layout, startLayout, dragHandlers, columnWidth, rowHeight, ref };
};
