import { get, readable, writable, type Writable } from 'svelte/store';
import { getContext, hasContext, setContext } from 'svelte';
import { getDevices, getNotifications, loraNetworks, features } from './utils/dummyData';
import type { comment } from './db/schema';
import type { Alarm, Device, Field, GeoJSONFeature, Metric, PartialBy } from './utils/types';
import { filterByUniqueAttribute, filterDuplicate } from './utils/arrays';

const STORE_VERSION = 'v15';
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
	const sharedStore = useSharedStore(`${name}-${STORE_VERSION}`, writable, value) as Writable<T>;

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

export const useGettingStarted = () => {
	const gettingStarted = useWritable<{ visible: boolean }>(
		'getting-started',
		{ visible: true },
		true
	);

	return {
		gettingStarted,
		setVisibility: (visible: boolean) =>
			gettingStarted.update((gettingStarted) => ({ ...gettingStarted, visible }))
	};
};
export const useDevices = () => {
	const devices = useWritable<Device[]>('devices', [], true);

	return {
		devices
	};
};
export const useNotifications = () => useWritable('notifications', dummyNotifications, true);
export const useFields = () => {
	const fields = useWritable<Field[]>('fields', [], true);

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
			layersIds.forEach((layerId) => removeFieldLayer(field, layerId)),
		getFieldById: (fieldId: string) => get(fields).find((it) => it.id === fieldId)
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

export const useOrganisations = () => {
	const organisations = useWritable<string[]>('organisations', [], true);
	return {
		organisations,
		addOrganisation: (organisation: string) =>
			organisations.update((organisations) =>
				[...organisations, organisation].filter(filterDuplicate)
			),
		deleteOrganisation: (organisation: string) =>
			organisations.update((organisations) => organisations.filter((it) => it !== organisation))
	};
};
export const useOrganisation = () =>
	useWritable<string | undefined>('organisation', undefined, true);
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
export const useDeviceIllustration = () => {
	const deviceIllustration = useWritable<{
		show: boolean;
		usb: boolean;
		jack: boolean;
		button: boolean;
	}>('device-illustration', {
		show: false,
		usb: false,
		jack: false,
		button: false
	});

	return {
		deviceIllustration,
		setVisibility: (visible: boolean) =>
			deviceIllustration.update((deviceIllustration) => ({ ...deviceIllustration, show: visible })),
		setUsb: (usb: boolean) =>
			deviceIllustration.update((deviceIllustration) => ({ ...deviceIllustration, usb })),
		setJack: (jack: boolean) =>
			deviceIllustration.update((deviceIllustration) => ({ ...deviceIllustration, jack })),
		setButton: (button: boolean) =>
			deviceIllustration.update((deviceIllustration) => ({ ...deviceIllustration, button })),
		reset: () =>
			deviceIllustration.update(() => ({ show: false, usb: false, jack: false, button: false }))
	};
};
