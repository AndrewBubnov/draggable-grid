import { useCallback, useEffect, useState } from 'react';
import { Layout } from '../types';

const getAsyncConfig = (): Promise<Layout | undefined> =>
	new Promise(resolve =>
		setTimeout(() => {
			const stored = localStorage.getItem('layout');
			resolve(stored ? (JSON.parse(stored) as Layout) : undefined);
		}, 1000)
	);

export const useUpdate = (): [Layout | undefined, (arg: Layout) => void] => {
	const [config, setConfig] = useState<Layout | undefined>();

	useEffect(() => {
		(async function () {
			const layout = await getAsyncConfig();
			setConfig(layout);
		})();
	}, []);

	const updateConfig = useCallback((layout: Layout) => localStorage.setItem('layout', JSON.stringify(layout)), []);

	return [config, updateConfig];
};
