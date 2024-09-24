import { get, readable, writable, type Writable } from 'svelte/store';
import { getContext, hasContext, setContext } from 'svelte';
import {
	getDevices,
	getFields,
	getNotifications,
	loraNetworks,
	features,
	organisations
} from './utils/dummyData';
import type { comment } from './db/schema';
import type { Alarm, Field, GeoJSONFeature, Metric, PartialBy } from './utils/types';
import { filterByUniqueAttribute } from './utils/arrays';

const STORE_VERSION = 'v13';
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
	const sharedStore = useSharedStore(name, writable, value) as Writable<T>;

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
export const useFields = () => {
	const fields = useWritable('fields', getFields(), true);

	const updateField = (field: PartialBy<Field, 'center' | 'layers' | 'name' | 'type'>) => {
		fields.update((fields) => {
			const fieldIndex = fields.findIndex((it) => it.id === field.id);

			if (fieldIndex > -1) {
				const newFields = [...fields];
				newFields[fieldIndex] = { ...newFields[fieldIndex], ...field };
				return newFields;
			}

			return fields;
		});
	};

	const removeFieldLayer = (field: Field, layerId: string | number | undefined) => {
		updateField({ ...field, layers: field.layers.filter((it) => it.id !== layerId) });
	};

	return {
		fields,
		addField: (field: Field) => fields.update((fields) => [...fields, field]),
		deleteField: (fieldId: string) => {
			fields.update((fields) => fields.filter((it) => it.id !== fieldId));
		},
		updateField,
		addFieldLayer: (field: Field, feature: GeoJSONFeature) => {
			updateField({ ...field, layers: filterByUniqueAttribute([...field.layers, feature], 'id') });
		},
		addFieldLayers: (field: Field, layers: GeoJSONFeature[]) =>
			updateField({
				...field,
				layers: filterByUniqueAttribute([...field.layers, ...layers], 'id')
			}),
		removeFieldLayer,
		removeFieldLayers: (field: Field, layersIds: string[]) =>
			layersIds.forEach((layerId) => removeFieldLayer(field, layerId))
	};
};
export const useBlurApp = () => useWritable('blur-app', false);
export const useUserName = () => useWritable('user-name', '', true);
export const useProfile = () =>
	useWritable(
		'profile',
		{
			firstName: 'Jon',
			lastName: 'Doe',
			role: 'Grower'
		},
		true
	);
export const useComments = () => useWritable<(typeof comment.$inferSelect)[]>('comments', []);
export const useReturnButton = () =>
	useWritable<{ label: string; href?: string } | undefined>('return-button', undefined);
export const useNetwork = () => useWritable('network', loraNetworks[0], true);
export const useScrollLock = () => {
	const scrollLock = useWritable('scroll-lock', false);
	scrollLock.subscribe((lock) => {
		if (typeof window !== 'undefined') {
			window.document.body.style.overflow = lock ? 'hidden' : '';
		}
	});

	return scrollLock;
};
export const useOrganisation = () => useWritable('organisation', organisations[0], true);
export const useIsOrganisation = () => useWritable('is-organisation', false, true);
export const useOrganisationName = () => useWritable('organisation-name', '', true);
export const useInvitedUsers = () => useWritable<string[]>('invited-users', [], true);
export const useGeoJSONFeatures = () => useWritable<GeoJSONFeature[]>('features', features, true);
export const useMetrics = () => {
	const metrics = useWritable<Metric[]>('metrics', [], true);

	return {
		metrics,
		addMetric: (metric: Metric) => {
			metrics.update((metrics) => [...metrics, metric]);
		},
		deleteMetric: (metricId: string) => {
			metrics.update((metrics) => metrics.filter((it) => it.id !== metricId));
		},
		updateMetric: (metric: PartialBy<Metric, 'fieldId' | 'type'>) => {
			metrics.update((metrics) => {
				const metricIndex = metrics.findIndex((it) => it.id === metric.id);

				if (metricIndex > -1) {
					const newMetrics = [...metrics];
					newMetrics[metricIndex] = { ...newMetrics[metricIndex], ...metric };
					return newMetrics;
				}

				return metrics;
			});
		},
		getMetricsByFieldId: (fieldId: string) => get(metrics).filter((it) => it.fieldId === fieldId),
		getMetricById: (metricId: string) => get(metrics).find((it) => it.id === metricId)
	};
};
export const useAlarms = () => {
	const alarms = useWritable<Alarm[]>('alarms', [], true);

	return {
		alarms,
		addAlarm: (alarm: Alarm) => alarms.update((alarms) => [...alarms, alarm]),
		removeAlarm: (alarmId: string) =>
			alarms.update((alarms) => alarms.filter((it) => it.id !== alarmId)),
		getAlarmsByFieldId: (fieldId: string) => get(alarms).filter((it) => it.fieldId === fieldId)
	};
};
