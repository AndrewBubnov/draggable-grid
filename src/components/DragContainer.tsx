import React, { Children, useRef } from 'react';
import { Draggable } from './Draggable';
import { DragContainerProps } from '../types';
import { useLayout } from '../hooks/useLayout';

export const DragContainer = ({ children }: DragContainerProps) => {
	const ghostImage = useRef<HTMLDivElement>(null);

	const { layout, startLayout, dragHandlers, getCoords, columnWidth, rowHeight } = useLayout();

	return (
		<>
			{Children.map(children, child => {
				return (
					<Draggable
						getCoords={getCoords}
						startLayout={startLayout}
						childrenStyle={layout}
						ghostImage={ghostImage}
						columnWidth={columnWidth}
						rowHeight={rowHeight}
						onDrag={dragHandlers}
					>
						{child}
					</Draggable>
				);
			})}
		</>
	);
};
