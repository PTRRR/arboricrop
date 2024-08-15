import { readable, writable } from 'svelte/store';
import { getContext, hasContext, setContext } from 'svelte';

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
