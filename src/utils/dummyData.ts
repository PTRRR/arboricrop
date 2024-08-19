import { createId } from '@paralleldrive/cuid2';
import type { Device, Field } from './types';

export const getFields = (): Field[] => [
	{
		id: createId(),
		name: 'Fruit plantation',
		type: 'Fruits',
		devices: []
	},
	{
		id: createId(),
		name: 'Vignard',
		type: 'Wine',
		devices: []
	},
	{
		id: createId(),
		name: 'Apples',
		type: 'Apples',
		devices: []
	}
];

export const getDevices = (count: number = 30): Device[] =>
	new Array(count).fill({}).map((_, index) => ({
		name: `Device ${index.toString().padStart(3, '0')}`,
		id: `dev-${createId()}`,
		battery: Math.floor(Math.random() * 100),
		medias: [],
		firmwareVersion: 'v1.0.9',
		status: 'active'
	}));
