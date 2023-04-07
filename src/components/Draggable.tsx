import { cloneElement, useRef, DragEvent, useId, useState } from 'react';
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
}: DraggableProps) => {
	const firstId = useId();
	const id = useRef(firstId);
	const ref = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState<boolean>(true);

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

	const dragStartHandler = () => {
		updateIds(id.current, DragStatus.START);
		setVisible(false);
	};

	const dragEndHandler = () => {
		updateIds(id.current, DragStatus.CANCEL);
		setVisible(true);
	};

	const visibilityClass = visible ? styles.visible : styles.invisible;

	return cloneElement(children, {
		ref,
		draggable: true,
		className: `${styles.tile} ${visibilityClass} ${children.props.className}`,
		style: renderStyle,
		onDragOver: dragOverHandler,
		onDragStart: dragStartHandler,
		onDragEnd: dragEndHandler,
		id: id.current,
	});
};
