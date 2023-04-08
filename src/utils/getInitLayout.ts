import { GetInitialStyleProp, Layout, TempLayout } from '../types';

export const getInitLayout = (array: GetInitialStyleProp[]) => {
	const sortedColumns = array.sort((a, b) => a.coords.x - b.coords.x);

	let currentX = sortedColumns[0].coords.x;
	let currentGridColumn = 1;

	const columnsOnly = sortedColumns.reduce((acc, cur) => {
		if (cur.coords.x > currentX) {
			currentX = cur.coords.x;
			currentGridColumn = currentGridColumn + 1;
		}
		acc[cur.id] = { column: currentGridColumn, width: cur.width, height: cur.height };
		return acc;
	}, {} as TempLayout);

	const sortedRaws = array.sort((a, b) => a.coords.y - b.coords.y);

	let currentY = sortedColumns[0].coords.y;
	let currentGridRow = 1;

	return sortedRaws.reduce((acc, cur) => {
		if (cur.coords.y > currentY) {
			currentY = cur.coords.y;
			currentGridRow = currentGridRow + 1;
		}
		acc[cur.id] = { ...columnsOnly[cur.id], row: currentGridRow };
		return acc;
	}, {} as Layout);
};
