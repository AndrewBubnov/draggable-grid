import { useEffect, useMemo, useState } from 'react';
import { DELTA_X, DELTA_Y } from '../constants';
import { Initial, Location, UseRenderStyle, UseRenderStyleReturn } from '../types';

export const useRenderStyle = ({
	startLayout,
	childrenStyle,
	columnWidth,
	rowHeight,
	id,
}: UseRenderStyle): UseRenderStyleReturn => {
	const [initial, setInitial] = useState<Initial>(null);

	useEffect(() => setInitial(startLayout[id]), [startLayout, id]);

	return useMemo(() => {
		const startColumn = initial?.[Location.COLUMN] || 0;
		const startRow = initial?.[Location.ROW] || 0;
		const currentColumn = childrenStyle[id]?.[Location.COLUMN];
		const currentRow = childrenStyle[id]?.[Location.ROW];

		return {
			[DELTA_X]: `${(currentColumn - startColumn) * columnWidth}px`,
			[DELTA_Y]: `${(currentRow - startRow) * rowHeight}px`,
		};
	}, [childrenStyle, columnWidth, rowHeight, initial]);
};
