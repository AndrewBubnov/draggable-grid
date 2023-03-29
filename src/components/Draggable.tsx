import {cloneElement, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {nanoid} from 'nanoid'
import {DraggableProps} from "../types";
import {DELTA_X, GRID_COLUMN, GRID_ROW} from "../constants";


export const Draggable = ({children, getCoords, startStyle, childrenStyle, ghostImage, columnWidth}: DraggableProps) => {
    const [initial, setInitial] = useState<{ gridRow: number; gridColumn: number; } | null>(null);

    const id = useRef(nanoid());
    const ref = useRef<HTMLDivElement>(null);
    const dX = useRef<number>(0);
    const dY = useRef<number>(0);

    useLayoutEffect(() => {
        if (ref.current) {
            const {x, y, width, height} = ref.current.getBoundingClientRect();
            getCoords(id.current, {x, y, width, height})
        }
    }, []);

    useEffect(() => setInitial(prevState => prevState ? prevState : startStyle[id.current]), [startStyle]);

    const renderStyle = useMemo(() => {
        const startColumn = initial?.gridColumn || 0;
        const startRow = initial?.gridRow || 0;
        const currentColumn = childrenStyle[id.current]?.gridColumn;

        return {
            [GRID_COLUMN]: startColumn,
            [GRID_ROW]: startRow,
            [DELTA_X]: `${(currentColumn - startColumn) * columnWidth}px`,
        };
    }, [childrenStyle, columnWidth, initial]);
    console.log(renderStyle);

    return cloneElement(children, {ref, draggable: true, style: initial});
}
