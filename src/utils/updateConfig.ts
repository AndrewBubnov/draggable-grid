import { Layout } from '../types';

export const updateConfig = (layout: Layout) => localStorage.setItem('layout', JSON.stringify(layout));
