import { Layout, LayoutItem, Location } from '../types';

const prepare = (state: Layout, start: string, end: string) => {
	const { width: startWidth, height: startHeight, row: startRow, column: startColumn } = state[start];
	const { width: endWidth, height: endHeight, row: endRow, column: endColumn } = state[end];

	const isDifferentRow = startRow !== endRow;
	const isDifferentColumn = startColumn !== endColumn;

	let isHorizontal = true;
	if (startWidth === endWidth) isHorizontal = isDifferentColumn;
	if (isDifferentRow) {
		isHorizontal = Math.abs(startColumn - endColumn) > Math.abs(startWidth - endWidth) && isDifferentColumn;
	}

	const [main, cross] = isHorizontal ? [Location.ROW, Location.COLUMN] : [Location.COLUMN, Location.ROW];

	const [size, startSize, endSize, crossSize] = isHorizontal
		? [Location.WIDTH, startWidth, endWidth, Location.HEIGHT]
		: [Location.HEIGHT, startHeight, endHeight, Location.WIDTH];

	const { [start]: startElement, [end]: endElement } = state;
	const keys = Object.keys(state) as Array<keyof typeof state>;

	return {
		startWidth,
		startHeight,
		startColumn,
		endWidth,
		endHeight,
		endRow,
		endColumn,
		isDifferentColumn,
		isDifferentRow,
		main,
		cross,
		size,
		startSize,
		endSize,
		crossSize,
		startElement,
		endElement,
		keys,
	};
};

const simple = (state: Layout, start: string, end: string): Layout => {
	const { main, cross, size, startSize, endSize, startElement, endElement, keys } = prepare(state, start, end);

	const containerElements = keys.filter(el => state[el][main] === state[end][main]);
	if (state[start][cross] > state[end][cross])
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
		main,
		cross,
		size,
		crossSize,
		startElement,
		endElement,
		keys,
		isDifferentColumn,
		startWidth,
		endWidth,
		startHeight,
		endHeight,
	} = prepare(state, start, end);

	const maxColumn = Math.max(...keys.map(key => state[key][Location.COLUMN]));
	const maxRow = Math.max(...keys.map(key => state[key][Location.ROW]));

	const getBoxSize = (element: LayoutItem, array: string[][], boxCrossSize: number): number => {
		const boxElements = array
			.slice(element[cross] - 1, element[cross] + element[size] - 1)
			.map(el => el.slice(element[main] - 1, element[main] + boxCrossSize - 1));
		const boxElementsMap = boxElements.flat().reduce((acc, cur) => {
			acc[cur] = acc[cur] ? acc[cur] + 1 : 1;
			return acc;
		}, {} as Record<string, number>);
		const crossDiff = Object.keys(boxElementsMap).reduce(
			(acc, cur) => acc + state[cur][Location.HEIGHT] * state[cur][Location.WIDTH] - boxElementsMap[cur],
			0
		);
		if (crossDiff) return getBoxSize(element, array, boxCrossSize + crossDiff);
		return boxCrossSize;
	};

	const getKeys = (array: string[][], element: LayoutItem, commonSize: number) => {
		const allKeys = array
			.slice(element[cross] - 1, element[cross] + element[size] - 1)
			.map(el => el.slice(element[main] - 1, element[main] + commonSize - 1))
			.flat();
		return [...new Set(allKeys)];
	};

	const getCommonBoxSize = (
		startElement: LayoutItem,
		endElement: LayoutItem,
		array: string[][],
		startBoxSize: number,
		endBoxSize: number
	): number => {
		const startBoxCrossSize = getBoxSize(startElement, array, startBoxSize);
		const endBoxCrossSize = getBoxSize(endElement, array, endBoxSize);
		if (startBoxCrossSize !== endBoxCrossSize) {
			const commonSize = Math.max(startBoxCrossSize, endBoxCrossSize);
			return getCommonBoxSize(startElement, endElement, array, commonSize, commonSize);
		}
		return startBoxCrossSize;
	};

	const createIdArray = () => {
		const columnsArray = Array(maxColumn).fill('');
		const rowsArray = Array(maxRow).fill('');

		const mappedState = keys.reduce((acc, cur) => {
			const current = state[cur];
			const rows =
				current[Location.HEIGHT] === 1
					? [current[Location.ROW]]
					: Array.from({ length: current[Location.HEIGHT] }, (_, i) => current[Location.ROW] + i);
			const columns =
				current[Location.WIDTH] === 1
					? [current[Location.COLUMN]]
					: Array.from({ length: current[Location.WIDTH] }, (_, i) => current[Location.COLUMN] + i);
			acc[cur] = { rows, columns };
			return acc;
		}, {} as Record<string, { rows: number[]; columns: number[] }>);

		return rowsArray.map((row, i1) =>
			columnsArray.map(
				(col, i2) =>
					keys.find(
						key => mappedState[key].columns.includes(i2 + 1) && mappedState[key].rows.includes(i1 + 1)
					) || ''
			)
		);
	};

	const getTarget = () => {
		const idArray = createIdArray();

		const commonSize = getCommonBoxSize(
			startElement,
			endElement,
			idArray,
			startElement[crossSize],
			endElement[crossSize]
		);

		const startKeys = getKeys(idArray, startElement, commonSize);
		const endKeys = getKeys(idArray, endElement, commonSize);

		return { startKeys, endKeys };
	};

	const complex = (): Layout => {
		const { main, cross, startElement, endElement } = prepare(state, start, end);
		const { startKeys, endKeys } = getTarget();

		return {
			...state,
			...startKeys.reduce((acc, cur) => {
				acc[cur] = {
					...state[cur],
					[cross]: endElement[cross] - startElement[cross] + state[cur][cross],
					[main]: endElement[main] - startElement[main] + state[cur][main],
				};
				return acc;
			}, {} as Layout),
			...endKeys.reduce((acc, cur) => {
				acc[cur] = {
					...state[cur],
					[cross]: startElement[cross] - endElement[cross] + state[cur][cross],
					[main]: startElement[main] - endElement[main] + state[cur][main],
				};
				return acc;
			}, {} as Layout),
		};
	};

	const moveImpossible =
		(main === 'row' &&
			endElement[Location.ROW] === maxRow &&
			startElement[Location.HEIGHT] > endElement[Location.HEIGHT]) ||
		(startElement[Location.ROW] === maxRow && endElement[Location.HEIGHT] > startElement[Location.HEIGHT]) ||
		(main === 'column' &&
			endElement[Location.COLUMN] === maxColumn &&
			startElement[Location.WIDTH] > endElement[Location.WIDTH]) ||
		(startElement[Location.COLUMN] === maxColumn && endElement[Location.WIDTH] > startElement[Location.WIDTH]);

	if (moveImpossible) return state;

	const diagonalEqual = () => ({ ...state, [start]: endElement, [end]: startElement });

	if (isDifferentColumn && isDifferentColumn && startWidth === endWidth && startHeight === endHeight)
		return diagonalEqual();

	if (startElement[crossSize] === endElement[crossSize]) return simple(state, start, end);

	return complex();
};
