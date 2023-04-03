import { Layout, Location } from '../types';

const prepare = (state: Layout, start: string, end: string) => {
	const { width: startWidth, height: startHeight, row: startRow, column: startColumn } = state[start];
	const { width: endWidth, height: endHeight, row: endRow, column: endColumn } = state[end];

	const isSameRow = startRow === endRow;
	const isSameColumn = startColumn === endColumn;

	const [main, cross] = startColumn !== endColumn ? [Location.ROW, Location.COLUMN] : [Location.COLUMN, Location.ROW];

	const [size, startSize, endSize, crossSize] =
		startColumn !== endColumn
			? [Location.WIDTH, startWidth, endWidth, Location.HEIGHT]
			: [Location.HEIGHT, startHeight, endHeight, Location.WIDTH];

	const { [start]: startElement, [end]: endElement } = state;
	return {
		startWidth,
		startHeight,
		startColumn,
		endWidth,
		endHeight,
		endRow,
		endColumn,
		isSameRow,
		isSameColumn,
		main,
		cross,
		size,
		startSize,
		endSize,
		crossSize,
		startElement,
		endElement,
	};
};

const simple = (state: Layout, start: string, end: string): Layout => {
	const { main, cross, size, startSize, endSize, startElement, endElement } = prepare(state, start, end);
	const keys = Object.keys(state) as Array<keyof typeof state>;

	const containerElements = keys.filter(el => state[el][main] === state[end][main]);
	const fromRight = state[start][cross] > state[end][cross];
	if (fromRight)
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
					return { ...acc, [el]: state[el] };
				}
				return { ...acc, [el]: { ...state[el], [cross]: element[cross] + startSize - endSize } };
			}, {} as Layout),
		};
	return simple(state, end, start);
};

export const recalculatePositions = (state: Layout, start: string, end: string): Layout => {
	const {
		startWidth,
		startHeight,
		endWidth,
		endHeight,
		endRow,
		endColumn,
		isSameRow,
		isSameColumn,
		main,
		cross,
		size,
		crossSize,
		startElement,
		endElement,
	} = prepare(state, start, end);

	if (startElement[crossSize] < endElement[crossSize]) return state;

	const keys = Object.keys(state) as Array<keyof typeof state>;

	const diagonalEqual = () => ({ ...state, [start]: endElement, [end]: startElement });

	const getTarget = (): [string[], boolean] => {
		const startSquare = startWidth * startHeight;
		const target = keys
			.filter(
				key =>
					key !== start &&
					state[key][Location.COLUMN] >= endColumn &&
					state[key][Location.ROW] >= endRow &&
					state[key][Location.COLUMN] <= endColumn + startWidth - endWidth &&
					state[key][Location.ROW] <= endRow + startHeight - endHeight
			)
			.slice(0, startSquare / (endWidth * endHeight));
		const targetSquare = target.reduce(
			(acc, cur) => acc + state[cur][Location.WIDTH] * state[cur][Location.HEIGHT],
			0
		);
		const allowedSingle = (target.length === 1 && isSameColumn) || (target.length === 1 && isSameRow);
		return [target, allowedSingle || targetSquare === startSquare];
	};

	const diagonalNotEqual = () => {
		const [target, allowed] = getTarget();

		if (!allowed) return state;
		let sumCounter = 0;
		return {
			...state,
			[start]: {
				...endElement,
				[Location.WIDTH]: startElement[Location.WIDTH],
				[Location.HEIGHT]: startElement[Location.HEIGHT],
			},
			...target.reduce((acc, cur) => {
				acc[cur] = { ...state[cur], [cross]: startElement[cross] + sumCounter, [main]: startElement[main] };
				sumCounter = sumCounter + state[cur][size];
				return acc;
			}, {} as Layout),
		};
	};

	const perpendicular = () => {
		const [target, allowed] = getTarget();

		if (!allowed) return state;

		let sumCounter = 0;
		return {
			...state,
			[start]: {
				...endElement,
				[Location.WIDTH]: startElement[Location.WIDTH],
				[Location.HEIGHT]: startElement[Location.HEIGHT],
			},
			...target.reduce((acc, cur) => {
				acc[cur] = { ...state[cur], [cross]: startElement[cross], [main]: startElement[main] + sumCounter };
				sumCounter = sumCounter + state[cur][crossSize];
				return acc;
			}, {} as Layout),
		};
	};

	if (startElement[size] > endElement[size] && startElement[main] !== endElement[main]) return diagonalNotEqual();

	if (startElement[crossSize] > endElement[crossSize]) return perpendicular();

	if (!isSameRow && !isSameColumn && startWidth === endWidth && startHeight === endHeight) return diagonalEqual();

	return simple(state, end, start);
};
