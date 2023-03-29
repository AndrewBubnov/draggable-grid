import {MutableRefObject, ReactElement} from "react";

export interface DragContainerProps {
    children: ReactElement[];
}

export interface Coords {
    x: number,
    y: number,
    width: number,
    height: number
}

export type ChildrenStyle = Record<string, { gridRow: number, gridColumn: number }>;
export type TempStyle = Record<string, { gridRow?: number, gridColumn: number }>;

export interface DraggableProps {
    children: ReactElement;
    getCoords: (arg0: string, arg1: {x: number, y: number, width: number, height: number}) => void;
    startStyle: ChildrenStyle;
    childrenStyle: ChildrenStyle;
    ghostImage: MutableRefObject<HTMLDivElement | null>;
    columnWidth: number;
}
