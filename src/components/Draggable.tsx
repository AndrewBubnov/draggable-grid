import { cloneElement, useLayoutEffect, useRef, DragEvent } from 'react';
import { nanoid } from 'nanoid';
import { DraggableProps, DragStatus } from '../types';
import { useRenderStyle } from '../hooks/useRenderStyle';
import styles from './Draggable.module.css';
import { getTarget } from '../utils/getTarget';
import { DELTA_X } from '../constants';

export const Draggable = ({
	children,
	getCoords,
	startLayout,
	childrenStyle,
	ghostImage,
	columnWidth,
	rowHeight,
	onDrag,
}: DraggableProps) => {
	const id = useRef(nanoid());

	const ref = useRef<HTMLDivElement>(null);
	const dX = useRef<number>(0);
	const dY = useRef<number>(0);

	const renderStyle = useRenderStyle({
		startLayout,
		childrenStyle,
		columnWidth,
		rowHeight,
		id: id.current,
	});

	useLayoutEffect(() => {
		if (ref.current) {
			const { x, y, width, height } = ref.current.getBoundingClientRect();
			getCoords(id.current, { x, y, width, height });
		}
	}, []);

	const dragOverHandler = (e: DragEvent<HTMLDivElement>) => e.preventDefault();

	const dragStartHandler = (evt: DragEvent<HTMLDivElement>) => {
		const target = getTarget(evt.target as HTMLDivElement);
		const { x, y } = target.getBoundingClientRect();
		dX.current = evt.clientX - x + parseFloat(renderStyle[DELTA_X]);
		dY.current = evt.clientY - y;
		onDrag(id.current, DragStatus.START);
	};

	const ghostImageHandler = (evt: DragEvent<HTMLDivElement>) => {
		if (!ghostImage.current) return;
		ghostImage.current.style.left = `${evt.clientX - dX.current}px`;
		ghostImage.current.style.top = `${evt.clientY - dY.current}px`;
	};

	const dragEndHandler = () => {
		ghostImage.current = null;
		onDrag(id.current, DragStatus.CANCEL);
	};

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
		onDrag: ghostImageHandler,
		id: id.current,
	});
};
