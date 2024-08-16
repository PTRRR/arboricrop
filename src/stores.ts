import { readable, writable } from 'svelte/store';
import { getContext, hasContext, setContext } from 'svelte';
import { getDevices } from './utils/devices';
import type { comment } from './db/schema';

export const useSharedStore = <T, A>(name: string, fn: (value?: A) => T, defaultValue?: A) => {
	if (hasContext(name)) {
		return getContext<T>(name);
	}
	const _value = fn(defaultValue);
	setContext(name, _value);
	return _value;
};

export const useWritable = <T>(name: string, value: T) => useSharedStore(name, writable, value);
export const useReadable = <T>(name: string, value: T) => useSharedStore(name, readable, value);

// Stores
export const useReturnButton = () =>
	useWritable<{ label: string; href?: string } | undefined>('return-button', undefined);
export const useDevices = () => useWritable('devices', getDevices(30));
export const useBlurApp = () => useWritable('blur-app', false);
export const useUserName = () => useWritable('user-name', '');
export const useComments = () => useWritable<(typeof comment.$inferSelect)[]>('comments', []);
