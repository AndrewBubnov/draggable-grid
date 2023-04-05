import { Layout } from '../types';

export const getAsyncConfig = (): Promise<Layout | undefined> =>
	new Promise(resolve =>
		setTimeout(() => {
			const stored = localStorage.getItem('layout');
			resolve(stored ? (JSON.parse(stored) as Layout) : undefined);
		}, 1000)
	);
