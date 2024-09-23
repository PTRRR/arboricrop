import type { LngLatLike } from 'svelte-maplibre';
import type { Feature, GeoJsonProperties, Geometry } from 'geojson';

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type MediaType = 'image' | 'audio-note' | 'file';

export type Media = {
	name: string;
	type: MediaType;
};

export type Location = {
	x: number;
	y: number;
};

export type MapLayer = {
	id: string;
	name: string;
	feature: GeoJSONFeature;
};

export type Status = 'active' | 'unactive';

export type Device = {
	id: string;
	name?: string;
	note?: string;
	firmwareVersion?: string;
	medias: Media[];
	fieldId?: string;
	battery?: number;
	status: Status;
	location?: LngLatLike;
};

export type Field = {
	id: string;
	name: string;
	type: string;
	center: LngLatLike;
	layers: GeoJSONFeature[];
};

export type NotificationType = 'notification' | 'warning' | 'alert';
export type NotificationStatus = 'pending' | 'acknowledged';

export type Notification = {
	id: string;
	date: string;
	title: string;
	text: string;
	type: NotificationType;
	deviceId?: string;
	status: NotificationStatus;
	actionableInsight?: string;
};

export type Marker = { lngLat: LngLatLike; label?: string };
export type GeoJSONFeature = Feature<Geometry, GeoJsonProperties>;

export type Tab = {
	value: string;
	label?: string;
};

export type Metric = {
	id: string;
	fieldId: string;
	type: string;
};

export type Alarm = {
	id: string;
	fieldId: string;
	metricId?: string;
	name?: string;
	threshold?: number;
	dataPoints?: number;
	period?: number;
	notificationStrategies?: string[];
};
