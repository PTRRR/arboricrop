import { createId } from '@paralleldrive/cuid2';
import type { Device, Field, MapLayer, Notification } from './types';
import type { GeoJSON as GeoJSONType, Feature, Geometry, GeoJsonProperties } from 'geojson';
import { shuffle } from './arrays';
import { getRandomDate } from './dates';
import type { LngLatLike } from 'svelte-maplibre';
import { mapValue } from './math';

export const changinCenter: LngLatLike = [6.231351138336578, 46.398638192299046];

export const getFields = (): Field[] => [
	{
		id: `fie-${createId()}`,
		name: 'Fruit plantation',
		type: 'Fruits',
		layers: [],
		center: changinCenter
	},
	{
		id: `fie-${createId()}`,
		name: 'Vignard',
		type: 'Wine',
		layers: [],
		center: changinCenter
	},
	{
		id: `fie-${createId()}`,
		name: 'Apples',
		type: 'Apples',
		layers: [],
		center: changinCenter
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
		location: [
			changinCenter[0] + mapValue(Math.random(), 0, 1, -0.002, 0.002),
			changinCenter[1] + mapValue(Math.random(), 0, 1, -0.002, 0.002)
		]
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

const defaultFeature: Feature<Geometry, GeoJsonProperties> = {
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
};

export const changinGeoJson: GeoJSONType = {
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
		},
		{
			type: 'Feature',
			properties: {},
			geometry: {
				coordinates: [
					[
						[6.231049095862517, 46.39815921645487],
						[6.230361865806174, 46.39770945211407],
						[6.230649380421767, 46.39748215044571],
						[6.231333104200672, 46.39794642518581],
						[6.231049095862517, 46.39815921645487]
					]
				],
				type: 'Polygon'
			}
		},
		{
			type: 'Feature',
			properties: {},
			geometry: {
				coordinates: [
					[
						[6.23029875284206, 46.39867910072397],
						[6.230074351191689, 46.398534017240024],
						[6.230789631453234, 46.39802864009255],
						[6.231014033103577, 46.398178561074474],
						[6.23029875284206, 46.39867910072397]
					]
				],
				type: 'Polygon'
			}
		},
		{
			type: 'Feature',
			properties: {},
			geometry: {
				coordinates: [
					[
						[6.230046300985464, 46.39852192693229],
						[6.229632560441473, 46.398265611778044],
						[6.230337321876249, 46.39773363308689],
						[6.23076859379853, 46.39801896775697],
						[6.230670418076471, 46.39807458366292],
						[6.230523154493454, 46.39798269648344],
						[6.230021757054317, 46.39837442496247],
						[6.230144476707409, 46.39845180309473],
						[6.230046300985464, 46.39852192693229]
					]
				],
				type: 'Polygon'
			}
		},
		{
			type: 'Feature',
			properties: {},
			geometry: {
				coordinates: [
					[
						[6.229601003959999, 46.39745555125245],
						[6.229832418161919, 46.39759096519214],
						[6.229867480919779, 46.397825520685785],
						[6.229653598096235, 46.39801413158858],
						[6.229320501895955, 46.398004459250444],
						[6.229064543764082, 46.39785695588182],
						[6.2290014307988315, 46.397588547089015],
						[6.229176744589239, 46.3974313701564],
						[6.229601003959999, 46.39745555125245]
					]
				],
				type: 'Polygon'
			}
		},
		{
			type: 'Feature',
			properties: {},
			geometry: {
				coordinates: [
					[
						[6.230232133576237, 46.397690107323996],
						[6.229699179655569, 46.39737575359035],
						[6.229201288493925, 46.397363663026],
						[6.229099606495538, 46.397320136972155],
						[6.229622041588328, 46.396860693174375],
						[6.230509129363867, 46.39747973233361],
						[6.230232133576237, 46.397690107323996]
					]
				],
				type: 'Polygon'
			}
		}
	]
};

export const mapLayers: MapLayer[] = [
	{
		id: createId(),
		name: 'Greenhouse Changin',
		feature:
			changinGeoJson.type === 'FeatureCollection' ? changinGeoJson.features[0] : defaultFeature
	},
	{
		id: createId(),
		name: 'Barn Westfield',
		feature:
			changinGeoJson.type === 'FeatureCollection' ? changinGeoJson.features[1] : defaultFeature
	},
	{
		id: createId(),
		name: 'Water Tower',
		feature:
			changinGeoJson.type === 'FeatureCollection' ? changinGeoJson.features[2] : defaultFeature
	},
	{
		id: createId(),
		name: 'Farmhouse East',
		feature:
			changinGeoJson.type === 'FeatureCollection' ? changinGeoJson.features[3] : defaultFeature
	},
	{
		id: createId(),
		name: 'Irrigation Control Center',
		feature:
			changinGeoJson.type === 'FeatureCollection' ? changinGeoJson.features[4] : defaultFeature
	},
	{
		id: createId(),
		name: 'Storage Silo',
		feature:
			changinGeoJson.type === 'FeatureCollection' ? changinGeoJson.features[5] : defaultFeature
	},
	{
		id: createId(),
		name: 'Machinery Garage',
		feature:
			changinGeoJson.type === 'FeatureCollection' ? changinGeoJson.features[6] : defaultFeature
	},
	{
		id: createId(),
		name: 'Solar Panel Array',
		feature:
			changinGeoJson.type === 'FeatureCollection' ? changinGeoJson.features[7] : defaultFeature
	},
	{
		id: createId(),
		name: 'Grain Processing Unit',
		feature:
			changinGeoJson.type === 'FeatureCollection' ? changinGeoJson.features[8] : defaultFeature
	}
];
