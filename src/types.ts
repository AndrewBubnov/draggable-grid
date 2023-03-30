import { ReactElement } from 'react';
import { DELTA_X, DELTA_Y } from './constants';

export interface DragContainerProps {
	children: ReactElement[];
	className: string;
}

export interface Coords {
	x: number;
	y: number;
	width: number;
	height: number;
}

export enum Location {
	COLUMN = 'column',
	ROW = 'row',
	WIDTH = 'width',
	HEIGHT = 'height',
}

interface LayoutItem {
	[Location.ROW]: number;
	[Location.COLUMN]: number;
	[Location.WIDTH]: number;
	[Location.HEIGHT]: number;
}

interface TempLayoutItem {
	row?: number;
	column: number;
	width: number;
	height: number;
}

export type Layout = Record<string, LayoutItem>;
export type TempLayout = Record<string, TempLayoutItem>;

export interface DraggableProps {
	children: ReactElement;
	startLayout: Layout;
	childrenStyle: Layout;
	columnWidth: number;
	rowHeight: number;
	onDrag(el: string, status: DragStatus): void;
}

export enum DragStatus {
	START = 'start',
	END = 'end',
	CANCEL = 'cancel',
}

export interface UseRenderStyle {
	startLayout: Layout;
	childrenStyle: Layout;
	columnWidth: number;
	rowHeight: number;
	id: string;
}

export interface UseRenderStyleReturn {
	[DELTA_X]: string;
	[DELTA_Y]: string;
}

export type Initial = { [Location.ROW]: number; [Location.COLUMN]: number } | null;

export interface GetInitialStyleProp {
	id: string;
	coords: Coords;
	width: number;
	height: number;
}
