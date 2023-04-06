import React, { Children } from 'react';
import { Draggable } from './Draggable';
import { DragContainerProps } from '../types';
import { useLayout } from '../hooks/useLayout';

export const DragContainer = ({ children, className, config, updateConfig }: DragContainerProps) => {
	const { layout, startLayout, columnWidth, rowHeight, ref, updateIds, reorderAllowed } = useLayout(
		config,
		updateConfig
	);

	return (
		<div className={className} ref={ref}>
			{Children.map(children, child => {
				return (
					<Draggable
						startLayout={startLayout}
						childrenStyle={layout}
						columnWidth={columnWidth}
						rowHeight={rowHeight}
						updateIds={updateIds}
						transitionRef={reorderAllowed}
					>
						{child}
					</Draggable>
				);
			})}
		</div>
	);
};
