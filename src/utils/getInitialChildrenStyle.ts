import { Coords, TempStyle } from '../types';

export const getInitialChildrenStyle = (array: { id: string; coords: Coords }[]) => {
	const sortedColumns = array.sort((a, b) => a.coords.x - b.coords.x);
	let currentX = sortedColumns[0].coords.x;
	let currentGridColumn = 1;
	let style: TempStyle = {};
	sortedColumns.forEach(col => {
		if (col.coords.x > currentX) {
			currentX = col.coords.x;
			currentGridColumn = currentGridColumn + 1;
		}
		style = {
			...style,
			[col.id]: { gridColumn: currentGridColumn },
		};
	});
	const sortedRaws = array.sort((a, b) => a.coords.y - b.coords.y);
	let currentY = sortedColumns[0].coords.y;
	let currentGridRow = 1;
	sortedRaws.forEach(raw => {
		if (raw.coords.y > currentY) {
			currentY = raw.coords.y;
			currentGridRow = currentGridRow + 1;
		}
		style = {
			...style,
			[raw.id]: {
				...style[raw.id],
				gridRow: currentGridRow,
			},
		};
	});
	return style;
};
