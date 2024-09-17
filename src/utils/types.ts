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
	name: string;
	polygon: Location[];
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
	location?: Location;
};

export type Field = {
	id: string;
	name: string;
	type: string;
	location: Location;
	layers: MapLayer[];
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
