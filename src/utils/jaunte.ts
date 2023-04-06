import { useSyncExternalStore } from 'react';
import {
	CreateReturn,
	FunctionalParam,
	ObjectParam,
	SetStateAction,
	Store,
	StoreCreator,
	SubscribeCallback,
	WithInternal,
} from '../types';

const merge = (...args: object[]) => Object.assign({}, ...args);

const useStore = <T extends WithInternal>(store: Store<T>): T => useSyncExternalStore(store.subscribe, store.getState);

const createStore = <T extends WithInternal>(storeCreator: StoreCreator<T>): Store<T> => {
	let store = {} as T;

	const subscribers = new Set<SubscribeCallback<T>>();

	const setter = (setStateAction: SetStateAction<T>) => {
		const isFunction = typeof setStateAction === 'function';
		const updated = isFunction ? (setStateAction as FunctionalParam<T>)(store) : (setStateAction as ObjectParam<T>);
		store = merge(store, updated);
		subscribers.forEach(callback => callback(store));
	};

	store = storeCreator(setter);

	return {
		getState: () => store,
		subscribe: callback => {
			subscribers.add(callback);
			return () => subscribers.delete(callback);
		},
	};
};

export const create = <T extends WithInternal>(storeCreator: StoreCreator<T>): CreateReturn<T> => {
	const store = createStore(storeCreator);
	// eslint-disable-next-line
	const hook = (bound: Store<T>) => useStore(bound);
	return [hook.bind(null, store), store.getState()];
};
