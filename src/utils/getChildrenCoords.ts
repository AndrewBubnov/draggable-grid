import { COLUMN_SPAN, ROW_SPAN } from '../constants';
import { getComputedParam } from './getComputedParam';

export const getChildrenCoords = (element: HTMLDivElement) =>
	Array.from(element.children || []).map(child => {
		const computed = getComputedStyle(child);
		const computedWidth = computed.getPropertyValue(COLUMN_SPAN);
		const computedHeight = computed.getPropertyValue(ROW_SPAN);
		return {
			id: child.id,
			coords: child.getBoundingClientRect(),
			width: getComputedParam(computedWidth),
			height: getComputedParam(computedHeight),
		};
	});
