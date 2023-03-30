import { ReactElement } from 'react';

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

export type Child = Record<string, { gridRow: number; gridColumn: number; width: number }>;
export type TempChild = Record<string, { gridRow?: number; gridColumn: number; width: number }>;

export interface DraggableProps {
	children: ReactElement;
	startLayout: Child;
	childrenStyle: Child;
	columnWidth: number;
	rowHeight: number;
	onDrag(el: string, status: DragStatus): void;
}

export enum DragStatus {
	START = 'start',
	END = 'end',
	CANCEL = 'cancel',
}
