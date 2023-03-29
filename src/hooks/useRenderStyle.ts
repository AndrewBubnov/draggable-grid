import { useEffect, useMemo, useState } from 'react';
import { DELTA_X, DELTA_Y, GRID_COLUMN, GRID_ROW } from '../constants';
import { ChildrenStyle } from '../types';

interface UseRenderStyle {
	startLayout: ChildrenStyle;
	childrenStyle: ChildrenStyle;
	columnWidth: number;
	rowHeight: number;
	id: string;
}

interface ReturnType {
	[GRID_COLUMN]: number;
	[GRID_ROW]: number;
	[DELTA_X]: string;
	[DELTA_Y]: string;
}

export const useRenderStyle = ({
	startLayout,
	childrenStyle,
	columnWidth,
	rowHeight,
	id,
}: UseRenderStyle): ReturnType => {
	const [initial, setInitial] = useState<{ gridRow: number; gridColumn: number } | null>(null);

	useEffect(() => setInitial(prevState => (prevState ? prevState : startLayout[id])), [startLayout]);

	return useMemo(() => {
		const startColumn = initial?.gridColumn || 0;
		const startRow = initial?.gridRow || 0;
		const currentColumn = childrenStyle[id]?.gridColumn;
		const currentRow = childrenStyle[id]?.gridRow;

		return {
			[GRID_COLUMN]: startColumn,
			[GRID_ROW]: startRow,
			[DELTA_X]: `${(currentColumn - startColumn) * columnWidth}px`,
			[DELTA_Y]: `${(currentRow - startRow) * rowHeight}px`,
		};
	}, [childrenStyle, columnWidth, rowHeight, initial]);
};
