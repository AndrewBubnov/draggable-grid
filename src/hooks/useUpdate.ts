import { useCallback, useEffect, useState } from 'react';
import { Layout } from '../types';
import { delayed, getConfig } from '../utils/delayed';

export const useUpdate = (): [Layout | undefined, (arg: Layout) => void] => {
	const [config, setConfig] = useState<Layout | undefined>();

	useEffect(() => {
		(async function () {
			const layout = await delayed(getConfig, 1000);
			setConfig(layout);
		})();
	}, []);

	const updateConfig = useCallback((layout: Layout) => localStorage.setItem('layout', JSON.stringify(layout)), []);

	return [config, updateConfig];
};
