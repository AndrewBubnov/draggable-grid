import { Layout, Location } from '../types';

export const recalculatePositions = (state: Layout, start: string, end: string): Layout => {
	const { width: startWidth, height: startHeight, row: startRow, column: startColumn } = state[start];
	const { width: endWidth, height: endHeight, row: endRow, column: endColumn } = state[end];

	const isSameRow = startRow === endRow;
	const isSameColumn = startColumn === endColumn;

	const [main, cross] = isSameRow ? [Location.ROW, Location.COLUMN] : [Location.COLUMN, Location.ROW];

	const [size, startSize, endSize, crossSize] = isSameRow
		? [Location.WIDTH, startWidth, endWidth, Location.HEIGHT]
		: [Location.HEIGHT, startHeight, endHeight, Location.WIDTH];

	const { [start]: startElement, [end]: endElement } = state;

	if (startElement[crossSize] < endElement[crossSize]) return state;

	const keys = Object.keys(state) as Array<keyof typeof state>;

	if (startElement[crossSize] > endElement[crossSize]) {
		const crossElements = keys
			.filter(el => state[el][cross] === state[end][cross])
			.sort((a, b) => state[a][main] - state[b][main]);

		const allTargetElements = crossElements.slice(crossElements.indexOf(end));

		const target: string[] = [];
		let sum = 0;
		allTargetElements.forEach(el => {
			if (sum < state[start][crossSize]) {
				sum = sum + state[el][crossSize];
				target.push(el);
			}
		});

		const allTargetWidth = target.reduce((acc, cur) => acc + state[cur][Location.WIDTH], 0);
		if (allTargetWidth < state[start][Location.WIDTH]) return state;
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
	}

	if (!isSameRow && !isSameColumn) {
		return {
			...state,
			[start]: endElement,
			[end]: startElement,
		};
	}

	const fromRight = state[start][cross] > state[end][cross];

	const containerElements = keys.filter(el => state[el][main] === state[end][main]);

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
					return { ...acc, [el]: state[el] };
				}
				return { ...acc, [el]: { ...state[el], [cross]: element[cross] + startSize - endSize } };
			}, {} as Layout),
		};
	}
	return recalculatePositions(state, end, start);
};
