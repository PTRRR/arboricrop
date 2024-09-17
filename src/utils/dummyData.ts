import { createId } from '@paralleldrive/cuid2';
import type { Device, Field, MapLayer, Notification } from './types';
import { shuffle } from './arrays';
import { getRandomDate } from './dates';

export const getFields = (): Field[] => [
	{
		id: `fie-${createId()}`,
		name: 'Fruit plantation',
		type: 'Fruits',
		layers: [],
		location: { x: 0, y: 0 }
	},
	{
		id: `fie-${createId()}`,
		name: 'Vignard',
		type: 'Wine',
		layers: [],
		location: { x: 0, y: 0 }
	},
	{
		id: `fie-${createId()}`,
		name: 'Apples',
		type: 'Apples',
		layers: [],
		location: { x: 0, y: 0 }
	}
];

export const getDevices = (count: number = 30): Device[] =>
	new Array(count).fill({}).map((_, index) => ({
		name: `Device ${index.toString().padStart(3, '0')}`,
		id: `dev-${createId()}`,
		battery: Math.floor(Math.random() * 100),
		medias: [],
		firmwareVersion: 'v1.0.9',
		status: 'unactive',
		location: {
			x: 40 + 20 * Math.random(),
			y: 40 + 20 * Math.random()
		}
	}));

export const getDevicesByFieldId = (devices: Device[], fieldId?: string) => {
	return devices.filter((it) => it.fieldId === fieldId);
};

export const dummyNotificationContents: Omit<Notification, 'id' | 'deviceId' | 'date'>[] = [
	{
		title: 'Low Battery Alert',
		text: "Your device's battery is low. Please recharge soon.",
		type: 'warning',
		status: 'pending',
		actionableInsight: 'Connect the device to a power source immediately to avoid disruption.'
	},
	{
		title: 'Device Offline',
		text: 'Device has lost connectivity. Please check the network.',
		type: 'alert',
		status: 'pending',
		actionableInsight: 'Verify the network connection and restart the device if necessary.'
	},
	{
		title: 'Sensor Maintenance Required',
		text: 'Routine maintenance is needed for optimal performance.',
		type: 'notification',
		status: 'pending',
		actionableInsight:
			'Schedule a maintenance check to ensure the device continues to function properly.'
	},
	{
		title: 'Battery Critical',
		text: 'Device battery is critically low. Immediate attention needed.',
		type: 'alert',
		status: 'pending',
		actionableInsight: 'Recharge the device immediately to prevent shutdown.'
	},
	{
		title: 'Device Calibration Needed',
		text: 'Please calibrate the device to ensure accurate readings.',
		type: 'notification',
		status: 'pending',
		actionableInsight: 'Follow the calibration guide to maintain data accuracy.'
	},
	{
		title: 'Network Disconnected',
		text: 'Device is not communicating. Check the network connection.',
		type: 'alert',
		status: 'pending',
		actionableInsight: 'Inspect network hardware and re-establish the connection.'
	},
	{
		title: 'Device Update Available',
		text: 'A new update is available to improve device performance.',
		type: 'notification',
		status: 'pending',
		actionableInsight: 'Download and install the latest firmware update.'
	},
	{
		title: 'Device Error',
		text: 'An error has been detected. Please troubleshoot the device.',
		type: 'alert',
		status: 'pending',
		actionableInsight: 'Refer to the troubleshooting guide or contact support.'
	},
	{
		title: 'Battery Status Low',
		text: "The device's power is running low. Recharge soon.",
		type: 'warning',
		status: 'pending',
		actionableInsight: 'Recharge the device to maintain operation.'
	},
	{
		title: 'Sensor Inactive',
		text: 'The sensor is inactive. Please verify the device connection.',
		type: 'alert',
		status: 'pending',
		actionableInsight: "Check the device's connection and restart if necessary."
	},
	{
		title: 'Device Overheating',
		text: 'Device is overheating. Take immediate preventative action.',
		type: 'alert',
		status: 'pending',
		actionableInsight: 'Move the device to a cooler location and check for ventilation.'
	},
	{
		title: 'Firmware Update Required',
		text: 'Keep your device updated for better performance.',
		type: 'notification',
		status: 'pending',
		actionableInsight: 'Update the firmware to ensure optimal performance.'
	},
	{
		title: 'Sensor Data Incomplete',
		text: 'Check the device functionality for complete data.',
		type: 'warning',
		status: 'pending',
		actionableInsight: 'Inspect the sensor and ensure it is functioning properly.'
	},
	{
		title: 'Device Signal Weak',
		text: 'Device signal is weak. Improve network connection.',
		type: 'warning',
		status: 'pending',
		actionableInsight: 'Move the device closer to the router or remove obstructions.'
	},
	{
		title: 'Device Reboot Needed',
		text: 'Please reboot the device for better performance.',
		type: 'notification',
		status: 'pending',
		actionableInsight: 'Restart the device to clear any temporary issues.'
	},
	{
		title: 'Device Sync Failed',
		text: 'Data sync failed. Ensure proper data transmission.',
		type: 'alert',
		status: 'pending',
		actionableInsight: 'Check network settings and try syncing the device again.'
	},
	{
		title: 'Low Signal Strength',
		text: 'The device signal is weak. Check the placement.',
		type: 'warning',
		status: 'pending',
		actionableInsight: "Adjust the device's position for a stronger signal."
	},
	{
		title: 'Device Health Check',
		text: 'Routine maintenance suggested for device health.',
		type: 'notification',
		status: 'pending',
		actionableInsight: 'Perform a health check to ensure ongoing device reliability.'
	},
	{
		title: 'Device Unresponsive',
		text: 'Device is unresponsive. Restart to restore functionality.',
		type: 'alert',
		status: 'pending',
		actionableInsight: 'Power cycle the device to regain functionality.'
	},
	{
		title: 'Device Connectivity Issue',
		text: 'Troubleshoot network settings for better connectivity.',
		type: 'warning',
		status: 'pending',
		actionableInsight: 'Check and adjust the network settings for improved connectivity.'
	}
];

export const getNotifications = (devices: Device[]): Notification[] => {
	const randomDevices = shuffle(devices).splice(0, 10);
	return randomDevices.map((it) => {
		const randomIndex = Math.floor(Math.random() * dummyNotificationContents.length);
		const randomContent = dummyNotificationContents[randomIndex];
		return {
			id: `not-${createId()}`,
			deviceId: it.id,
			date: getRandomDate(new Date('2024-08-01'), new Date('2024-08-30')).toISOString(),
			...randomContent
		};
	});
};

export const loraNetworks: string[] = [
	'The Things Network (TTN)',
	'Helium Network',
	'LORIOT',
	'Everynet',
	'Actility (ThingPark)',
	'Senet',
	'MachineQ (Comcast)',
	'Packetworx'
];

export const organisations: string[] = ['Vivent', 'Changin', 'ECAL'];

export const mapLayers: MapLayer[] = [
	{
		id: createId(),
		name: 'Greenhouse Changin',
		polygon: [
			{ x: 45, y: 40 },
			{ x: 50, y: 40 },
			{ x: 55, y: 45 },
			{ x: 55, y: 55 },
			{ x: 50, y: 60 },
			{ x: 45, y: 60 },
			{ x: 40, y: 55 },
			{ x: 40, y: 45 }
		]
	},
	{
		id: createId(),
		name: 'Barn Westfield',
		polygon: [
			{ x: 48, y: 42 },
			{ x: 52, y: 42 },
			{ x: 53, y: 46 },
			{ x: 53, y: 50 },
			{ x: 50, y: 52 },
			{ x: 47, y: 50 },
			{ x: 47, y: 46 }
		]
	},
	{
		id: createId(),
		name: 'Water Tower',
		polygon: [
			{ x: 49, y: 48 },
			{ x: 50, y: 46 },
			{ x: 52, y: 46 },
			{ x: 53, y: 48 },
			{ x: 52, y: 50 },
			{ x: 50, y: 50 }
		]
	},
	{
		id: createId(),
		name: 'Farmhouse East',
		polygon: [
			{ x: 45, y: 50 },
			{ x: 48, y: 50 },
			{ x: 50, y: 53 },
			{ x: 48, y: 56 },
			{ x: 45, y: 56 },
			{ x: 42, y: 53 }
		]
	},
	{
		id: createId(),
		name: 'Irrigation Control Center',
		polygon: [
			{ x: 47, y: 47 },
			{ x: 50, y: 47 },
			{ x: 52, y: 49 },
			{ x: 52, y: 52 },
			{ x: 50, y: 54 },
			{ x: 47, y: 54 },
			{ x: 45, y: 52 },
			{ x: 45, y: 49 }
		]
	},
	{
		id: createId(),
		name: 'Storage Silo',
		polygon: [
			{ x: 48, y: 44 },
			{ x: 51, y: 44 },
			{ x: 52, y: 47 },
			{ x: 51, y: 50 },
			{ x: 48, y: 50 },
			{ x: 47, y: 47 }
		]
	},
	{
		id: createId(),
		name: 'Machinery Garage',
		polygon: [
			{ x: 46, y: 48 },
			{ x: 50, y: 48 },
			{ x: 51, y: 50 },
			{ x: 50, y: 53 },
			{ x: 46, y: 53 },
			{ x: 45, y: 50 }
		]
	},
	{
		id: createId(),
		name: 'Solar Panel Array',
		polygon: [
			{ x: 44, y: 43 },
			{ x: 50, y: 43 },
			{ x: 51, y: 45 },
			{ x: 51, y: 47 },
			{ x: 50, y: 49 },
			{ x: 44, y: 49 },
			{ x: 43, y: 47 },
			{ x: 43, y: 45 }
		]
	},
	{
		id: createId(),
		name: 'Grain Processing Unit',
		polygon: [
			{ x: 45, y: 42 },
			{ x: 48, y: 42 },
			{ x: 50, y: 45 },
			{ x: 50, y: 48 },
			{ x: 48, y: 50 },
			{ x: 45, y: 50 },
			{ x: 43, y: 48 },
			{ x: 43, y: 45 }
		]
	},
	{
		id: createId(),
		name: 'Compost Facility',
		polygon: [
			{ x: 47, y: 44 },
			{ x: 51, y: 44 },
			{ x: 53, y: 47 },
			{ x: 53, y: 51 },
			{ x: 51, y: 54 },
			{ x: 47, y: 54 },
			{ x: 45, y: 51 },
			{ x: 45, y: 47 }
		]
	},
	{
		id: createId(),
		name: 'Main Office - Floor 1',
		polygon: [
			{ x: 40, y: 40 },
			{ x: 62, y: 40 },
			{ x: 62, y: 58 },
			{ x: 57, y: 58 },
			{ x: 57, y: 50 },
			{ x: 48, y: 50 },
			{ x: 48, y: 58 },
			{ x: 40, y: 58 }
		]
	},
	{
		id: createId(),
		name: 'Main Office - Floor 2',
		polygon: [
			{ x: 42, y: 42 },
			{ x: 60, y: 42 },
			{ x: 60, y: 56 },
			{ x: 56, y: 56 },
			{ x: 56, y: 48 },
			{ x: 50, y: 48 },
			{ x: 50, y: 56 },
			{ x: 42, y: 56 }
		]
	},
	{
		id: createId(),
		name: 'Main Office - Floor 3',
		polygon: [
			{ x: 43, y: 43 },
			{ x: 58, y: 43 },
			{ x: 58, y: 55 },
			{ x: 54, y: 55 },
			{ x: 54, y: 49 },
			{ x: 49, y: 49 },
			{ x: 49, y: 55 },
			{ x: 43, y: 55 }
		]
	}
];

export const changinGeoJson = {
	type: 'FeatureCollection',
	features: [
		{
			type: 'Feature',
			properties: {
				name: 'fruits'
			},
			geometry: {
				coordinates: [
					[
						[6.231019204069696, 46.399165917526574],
						[6.230814420900174, 46.39901738796689],
						[6.231382870732972, 46.398635105110515],
						[6.231601776880154, 46.39878120078612],
						[6.231019204069696, 46.399165917526574]
					]
				],
				type: 'Polygon'
			},
			id: 0
		},
		{
			type: 'Feature',
			properties: {
				name: 'tomatoes'
			},
			geometry: {
				coordinates: [
					[
						[6.230786174945706, 46.39900521339513],
						[6.230584922520592, 46.39886642308264],
						[6.231146310864517, 46.39847439941573],
						[6.231354624778447, 46.398610755793044],
						[6.230786174945706, 46.39900521339513]
					]
				],
				type: 'Polygon'
			},
			id: 1
		},
		{
			type: 'Feature',
			properties: {
				name: 'floor1'
			},
			geometry: {
				coordinates: [
					[
						[6.230916812484935, 46.39860101606337],
						[6.230690844849761, 46.39846709459991],
						[6.231396993710689, 46.397960625003435],
						[6.232265556808841, 46.398515793351635],
						[6.231792437071931, 46.39881528972069],
						[6.231679453254827, 46.3987398070509],
						[6.231630022834622, 46.398773896011335],
						[6.231146310864517, 46.39844031026814],
						[6.230916812484935, 46.39860101606337]
					]
				],
				type: 'Polygon'
			},
			id: 2
		},
		{
			type: 'Feature',
			properties: {
				name: 'floor2'
			},
			geometry: {
				coordinates: [
					[
						[6.231792437071931, 46.39881285479737],
						[6.231675922510362, 46.3987398070509],
						[6.231633553579087, 46.398773896011335],
						[6.231389932221816, 46.398605885928106],
						[6.231573530925658, 46.39849874879343],
						[6.231799498560804, 46.39864971469555],
						[6.231976035775773, 46.39853527284029],
						[6.231739475908228, 46.39839161144843],
						[6.231894828657573, 46.39828203894609],
						[6.232265556808841, 46.398515793351635],
						[6.231792437071931, 46.39881285479737]
					]
				],
				type: 'Polygon'
			},
			id: 3
		}
	]
};
