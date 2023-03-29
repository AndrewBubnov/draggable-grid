import React, { Children } from 'react';
import { Draggable } from './Draggable';
import { DragContainerProps } from '../types';
import { useLayout } from '../hooks/useLayout';

export const DragContainer = ({ children, className }: DragContainerProps) => {
	const { layout, startLayout, dragHandlers, columnWidth, rowHeight, ref } = useLayout();

	return (
		<div className={className} ref={ref}>
			{Children.map(children, child => {
				return (
					<Draggable
						startLayout={startLayout}
						childrenStyle={layout}
						columnWidth={columnWidth}
						rowHeight={rowHeight}
						onDrag={dragHandlers}
					>
						{child}
					</Draggable>
				);
			})}
		</div>
	);
};
