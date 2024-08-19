export type MediaType = 'image' | 'audio-note' | 'file';

export type Media = {
	name: string;
	type: MediaType;
};

export type Location = {
	x: number;
	y: number;
};

export type Status = 'active' | 'offline';

export type Device = {
	id: string;
	name?: string;
	note?: string;
	firmwareVersion?: string;
	medias: Media[];
	group?: string;
	battery?: number;
	status?: Status;
};

export type Field = {
	id: string;
	name: string;
	type: string;
};
