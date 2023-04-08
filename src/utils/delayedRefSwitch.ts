import { MutableRefObject } from 'react';
import { TRANSITION_DURATION } from '../constants';

export const delayedRefSwitch = async (ref: MutableRefObject<boolean>) => {
	const refSwitch = () => {
		ref.current = true;
		return true;
	};
	await new Promise(resolve => setTimeout(() => resolve(refSwitch()), TRANSITION_DURATION));
};
