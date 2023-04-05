import { useDebugValue, useSyncExternalStore } from 'react';
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

const extractData = <T extends WithInternal>(debugValue: T) =>
	(Object.keys(debugValue) as Array<keyof T>)
		.filter(key => typeof debugValue[key] !== 'function')
		.reduce((acc, cur) => {
			acc[cur] = debugValue[cur];
			return acc;
		}, {} as T);

const useStore = <T extends WithInternal>(store: Store<T>): T => {
	const { getState, subscribe } = store;

	const snapshot = useSyncExternalStore(subscribe, getState);
	useDebugValue(snapshot, extractData);
	return snapshot;
};

const createStore = <T extends WithInternal>(storeCreatorArg: StoreCreator<T>): Store<T> => {
	const [storeCreator, persistKey, persisted] = Array.isArray(storeCreatorArg) ? storeCreatorArg : [storeCreatorArg];

	let store = {} as T;

	const subscribers = new Set<SubscribeCallback<T>>();

	const setter = (setStateAction: SetStateAction<T>) => {
		const isFunction = typeof setStateAction === 'function';
		const updated = isFunction ? (setStateAction as FunctionalParam<T>)(store) : (setStateAction as ObjectParam<T>);
		store = merge(store, updated);
		subscribers.forEach(callback => callback(store));
	};

	store = storeCreator(setter);

	if (persistKey && persisted) store = merge(store, persisted);

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
	const hook = (bound: Store<T>) => useStore(bound);
	return [hook.bind(null, store), store.getState()];
};
