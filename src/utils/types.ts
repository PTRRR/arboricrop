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
	parentId?: string;
	battery?: number;
	status: Status;
	location?: LngLatLike;
	creationDate?: string;
	accountId?: string;
};

export type Account = {
	id: string;
	email: string;
	username?: string;
	password?: string;
	organizationName?: string;
	invitedAccounts?: string[];
	parentId?: string;
	role?: RoleName;
};

export type Field = {
	id: string;
	area: string;
	center: LngLatLike;
	layers: GeoJSONFeature[];
	loraConfigId: string;
	name: string;
	description?: string;
	type: string;
};

export type Project = {
	id: string;
	name: string;
	accountId: string;
	description?: string;
	loraConfiguration?: LoRaConfiguration;
};

export type Trial = Field & {
	accountId: string;
	parentId?: string;
};

export type NotificationType = 'notification' | 'warning' | 'alert';
export type NotificationStatus = 'pending' | 'acknowledged' | 'archived';

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

export type LoRaConfiguration = {
	name: string;
	frequency?: number;
	bandwidth?: number;
	spreadingFactor?: number;
	codingRate?: number;
	deviceEui?: string;
	appEui?: string;
	appKey?: string;
	isDefault?: boolean;
};

export type LoRaConfigurationWithId = LoRaConfiguration & { id: string };

export type RoleName = 'Viv superadmin' | 'Distributer' | 'Farmer Admin' | 'Farmer';

export type Group = {
	id: string;
	name: string;
	accountId?: string;
	description?: string;
	parentId?: string;
	deviceIds: string[];
};

export interface TrialNote {
	id: string;
	title: string;
	description: string;
	date: string;
	category:
		| 'planting'
		| 'irrigation'
		| 'fertilization'
		| 'pest_control'
		| 'harvesting'
		| 'observation'
		| 'maintenance';
	createdBy: string;
}
