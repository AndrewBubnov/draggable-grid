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

export type ChildrenStyle = Record<string, { gridRow: number; gridColumn: number }>;
export type TempStyle = Record<string, { gridRow?: number; gridColumn: number }>;

export interface DraggableProps {
	children: ReactElement;
	startLayout: ChildrenStyle;
	childrenStyle: ChildrenStyle;
	columnWidth: number;
	rowHeight: number;
	onDrag(el: string, status: DragStatus): void;
}

export enum DragStatus {
	START = 'start',
	END = 'end',
	CANCEL = 'cancel',
}
