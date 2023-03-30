import { cloneElement, useRef, DragEvent, useId } from 'react';
import { DraggableProps, DragStatus } from '../types';
import { useRenderStyle } from '../hooks/useRenderStyle';
import styles from './Draggable.module.css';

export const Draggable = ({ children, startLayout, childrenStyle, columnWidth, rowHeight, onDrag }: DraggableProps) => {
	const firstId = useId();
	const id = useRef(firstId);
	const ref = useRef<HTMLDivElement>(null);

	const renderStyle = useRenderStyle({
		startLayout,
		childrenStyle,
		columnWidth,
		rowHeight,
		id: id.current,
	});

	const dragOverHandler = (e: DragEvent<HTMLDivElement>) => e.preventDefault();

	const dragStartHandler = () => onDrag(id.current, DragStatus.START);

	const dragEndHandler = () => onDrag(id.current, DragStatus.CANCEL);

	const dropHandler = () => onDrag(id.current, DragStatus.END);

	return cloneElement(children, {
		ref,
		draggable: true,
		className: `${styles.tile} ${children.props.className}`,
		style: renderStyle,
		onDrop: dropHandler,
		onDragOver: dragOverHandler,
		onDragStart: dragStartHandler,
		onDragEnd: dragEndHandler,
		id: id.current,
	});
};
