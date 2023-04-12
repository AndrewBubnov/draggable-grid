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

export const recalculatePositions = (state: Layout, start: string, end: string): Layout => {
	const { main, cross, size, crossSize, startElement, endElement, keys } = prepare(state, start, end);

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

	const getTarget = () => {
		const maxColumn = Math.max(...keys.map(key => state[key][Location.COLUMN]));
		const maxRow = Math.max(...keys.map(key => state[key][Location.ROW]));
		const columnsArray = Array(maxColumn).fill('');
		const rowsArray = Array(maxRow).fill('');
		const array: string[][] = [];

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

		rowsArray.forEach((row, i1) => {
			const inner: string[] = [];
			columnsArray.forEach((col, i2) => {
				inner[i2] =
					keys.find(
						key => mappedState[key].columns.includes(i2 + 1) && mappedState[key].rows.includes(i1 + 1)
					) || '';
			});
			array[i1] = inner;
		});

		const commonSize = getCommonBoxSize(
			startElement,
			endElement,
			array,
			startElement[crossSize],
			endElement[crossSize]
		);

		const startKeys = array
			.slice(startElement[cross] - 1, startElement[cross] + startElement[size] - 1)
			.map(el => el.slice(startElement[main] - 1, startElement[main] + commonSize - 1))
			.flat();

		const endKeys = array
			.slice(endElement[cross] - 1, endElement[cross] + endElement[size] - 1)
			.map(el => el.slice(endElement[main] - 1, endElement[main] + commonSize - 1))
			.flat();
		return { startKeys: [...new Set(startKeys)], endKeys: [...new Set(endKeys)] };
	};

	const complex = (): Layout => {
		const { main, cross, startElement, endElement } = prepare(state, start, end);
		const { startKeys, endKeys } = getTarget();

		return {
			...state,
			...startKeys.reduce((acc, cur) => {
				acc[cur] = {
					...state[cur],
					[cross]: endElement[cross] + state[cur][cross],
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

	if (startElement[size] === endElement[size] && startElement[crossSize] === endElement[crossSize]) {
		return {
			...state,
			[start]: {
				...startElement,
				[main]: endElement[main],
				[cross]: endElement[cross],
			},
			[end]: {
				...endElement,
				[main]: startElement[main],
				[cross]: startElement[cross],
			},
		};
	}

	return complex();
};
