import { MutableRefObject } from 'react';
import { Layout } from '../types';

export const delayed = async <T>(fn: () => T, delay: number) =>
	await new Promise<T>(resolve => setTimeout(() => resolve(fn()), delay));

export const getConfig = () => {
	const stored = localStorage.getItem('layout');
	return stored ? (JSON.parse(stored) as Layout) : undefined;
};

export const refSwitch = (ref: MutableRefObject<boolean>) => () => {
	ref.current = true;
	return true;
};
