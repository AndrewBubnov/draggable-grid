import { useLayoutEffect, useRef, useState } from 'react';
import { ChildrenStyle, Coords, DragStatus } from '../types';
import { getInitialChildrenStyle } from '../utils/getInitialChildrenStyle';

export const useLayout = () => {
	const [layout, setLayout] = useState<ChildrenStyle>({} as ChildrenStyle);
	const [startLayout, setStartLayout] = useState<ChildrenStyle>({} as ChildrenStyle);
	const [columnWidth, setColumnWidth] = useState<number>(0);
	const [rowHeight, setRowHeight] = useState<number>(0);

	const coordsArray = useRef<{ id: string; coords: Coords }[]>([]);
	const tiles = useRef<{ start: string | ''; end: string | '' }>({ start: '', end: '' });

	useLayoutEffect(() => {
		if (!coordsArray.current.length) return;
		const { current } = coordsArray;
		const { style, width, height } = getInitialChildrenStyle(current);

		setStartLayout(style as ChildrenStyle);
		setColumnWidth(width);
		setRowHeight(height);
	}, []);

	useLayoutEffect(
		() => setLayout(prevState => (Object.keys(prevState).length ? prevState : startLayout)),
		[startLayout]
	);

	const getCoords = (id: string, coords: Coords) => coordsArray.current.push({ id, coords });

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

	return { layout, startLayout, dragHandlers, getCoords, columnWidth, rowHeight };
};
