import { Layout, Location } from '../types';

export const recalculatePositions = (state: Layout, start: string, end: string): Layout => {
	const { width: startWidth, height: startHeight, row: startRow, column: startColumn } = state[start];
	const { width: endWidth, height: endHeight, row: endRow, column: endColumn } = state[end];

	// Find is elements are dragged within same row
	const isSameRow = startRow === endRow;
	const isSameColumn = startColumn === endColumn;
	// Appoint main and secondary (cross) axis depended on drag direction (row / column)
	const [main, cross] = isSameRow ? [Location.ROW, Location.COLUMN] : [Location.COLUMN, Location.ROW];
	// Appoint size parameter and its value of start and end element
	const [size, startSize, endSize, crossSize] = isSameRow
		? [Location.WIDTH, startWidth, endWidth, Location.HEIGHT]
		: [Location.HEIGHT, startHeight, endHeight, Location.WIDTH];
	// Find set of elements that could change positions (current row  / column)
	const containerElements = (Object.keys(state) as Array<keyof typeof state>).filter(
		el => state[el][main] === state[end][main]
	);
	const { [start]: startElement, [end]: endElement } = state;

	if (startElement[crossSize] < endElement[crossSize]) return state;

	if (!isSameRow && !isSameColumn) {
		return {
			...state,
			[start]: endElement,
			[end]: startElement,
		};
	}

	const fromRight = state[start][cross] > state[end][cross];

	if (fromRight) {
		return {
			...state,
			...containerElements.reduce((acc, el) => {
				const { [el]: element } = state;
				if (el === start) return { ...acc, [start]: { ...endElement, [size]: startSize } };
				if (el === end) {
					return {
						...acc,
						[end]: {
							...startElement,
							[cross]: startElement[cross] + startSize - endSize,
							[size]: endSize,
						},
					};
				}
				if (element[cross] < endElement[cross] || element[cross] > startElement[cross]) {
					// elements not between start and end
					return { ...acc, [el]: state[el] };
				}
				// elements between start and end
				return { ...acc, [el]: { ...state[el], [cross]: element[cross] + startSize - endSize } };
			}, {} as Layout),
		};
	}
	return recalculatePositions(state, end, start);
};
