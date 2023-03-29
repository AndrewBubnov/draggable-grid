import React, {Children, useLayoutEffect, useRef, useState} from 'react';
import { Draggable} from "./Draggable";
import {getInitialChildrenStyle} from "../utils/getInitialChildrenStyle";
import {ChildrenStyle, Coords, DragContainerProps} from "../types";


export const DragContainer = ({children}: DragContainerProps) => {
    const [startStyle, setStartStyle] = useState<ChildrenStyle>({} as ChildrenStyle);
    const [columnWidth, setColumnWidth] = useState<number>(0);
    const [rowHeight, setRowHeight] = useState<number>(0);

    const ghostImage = useRef<HTMLDivElement>(null);
    const coordsArray = useRef<{ id: string, coords: Coords }[]>([]);

    const getCoords = (id: string, coords: Coords) => coordsArray.current.push({id, coords});
    useLayoutEffect(() => {
        if (!coordsArray.current.length) return;
        const {current} = coordsArray;
        const { style, width, height } = getInitialChildrenStyle(current);

        setStartStyle(style as ChildrenStyle);
        setColumnWidth(width);
        setRowHeight(height);
    }, []);


    return (
        <>
            {Children.map(children, child => {
                return (
                    <Draggable
                        getCoords={getCoords}
                        startStyle={startStyle}
                        childrenStyle={startStyle}
                        ghostImage={ghostImage}
                        columnWidth={columnWidth}
                    >
                        {child}
                    </Draggable>
                )})}
        </>
    )
}
