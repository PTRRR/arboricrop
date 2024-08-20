import { readable, writable } from 'svelte/store';
import { getContext, hasContext, setContext } from 'svelte';
import { getDevices, getFields, getNotifications } from './utils/dummyData';
import type { comment } from './db/schema';

const STORE_VERSION = 'v4';
const dummyDevices = getDevices(30);
const dummyNotifications = getNotifications(dummyDevices);

export const useSharedStore = <T, A>(name: string, fn: (value?: A) => T, defaultValue?: A) => {
	if (hasContext(name)) {
		return getContext<T>(name);
	}
	const _value = fn(defaultValue);
	setContext(name, _value);
	return _value;
};

export const useWritable = <T>(name: string, value: T, persist: boolean = false) => {
	const sharedStore = useSharedStore(name, writable, value);

	if (typeof window !== 'undefined' && persist) {
		const storageValueKey = `${name}-${STORE_VERSION}`;
		const storedValue = window.localStorage.getItem(storageValueKey);
		if (!storedValue) {
			window.localStorage.setItem(storageValueKey, JSON.stringify({ value: undefined }));
		} else {
			sharedStore.set(JSON.parse(storedValue).value);
		}

		sharedStore.subscribe((value) => {
			if (typeof value !== 'undefined') {
				window.localStorage.setItem(storageValueKey, JSON.stringify({ value }));
			}
		});
	}

	return sharedStore;
};
export const useReadable = <T>(name: string, value: T) => useSharedStore(name, readable, value);

// Stores

export const useDevices = () => useWritable('devices', dummyDevices, true);
export const useNotifications = () => useWritable('notifications', dummyNotifications, true);
export const useFields = () => useWritable('fields', getFields(), true);
export const useBlurApp = () => useWritable('blur-app', false);
export const useUserName = () => useWritable('user-name', '', true);
export const useComments = () => useWritable<(typeof comment.$inferSelect)[]>('comments', []);
export const useReturnButton = () =>
	useWritable<{ label: string; href?: string } | undefined>('return-button', undefined);
