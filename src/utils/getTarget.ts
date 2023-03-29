import styles from '../components/Draggable.module.css';

export const getTarget = (node: HTMLDivElement): HTMLDivElement => {
	if (node.classList.contains(styles.tile)) return node;
	return getTarget(node.parentNode as HTMLDivElement);
};
