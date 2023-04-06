import { cloneElement, useRef, DragEvent, useId } from 'react';
import { DraggableProps, DragStatus } from '../types';
import { useRenderStyle } from '../hooks/useRenderStyle';
import styles from './Draggable.module.css';

export const Draggable = ({
	children,
	startLayout,
	childrenStyle,
	columnWidth,
	rowHeight,
	updateIds,
	transitionRef,
}: DraggableProps) => {
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

	const dragOverHandler = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		updateIds(id.current, DragStatus.END);
	};

	const dragStartHandler = () => updateIds(id.current, DragStatus.START);

	const dragEndHandler = () => updateIds(id.current, DragStatus.CANCEL);

	const transitionEndHandler = () => {
		transitionRef.current = true;
	};

	return cloneElement(children, {
		ref,
		draggable: true,
		className: `${styles.tile} ${children.props.className}`,
		style: renderStyle,
		onDragOver: dragOverHandler,
		onDragStart: dragStartHandler,
		onDragEnd: dragEndHandler,
		onTransitionEnd: transitionEndHandler,
		id: id.current,
	});
};
