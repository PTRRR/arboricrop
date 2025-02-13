import { createId } from '@paralleldrive/cuid2';
import type { Account, Device, Field, Notification } from './types';
import type { GeoJSON as GeoJSONType } from 'geojson';
import { shuffle } from './arrays';
import { formatDateToDDMMYYYY, getRandomDateRange } from './dates';
import type { LngLatBoundsLike, LngLatLike } from 'svelte-maplibre';
import { getGeoJSONFeatures } from './geoJSON';

export const changinCenter: LngLatLike = [6.231351138336578, 46.398638192299046];
export const swissBounds: LngLatBoundsLike = [
	[5.79962242885633, 45.750539855343845],
	[10.644593011831521, 47.93683935427566]
];

export const getFields = (): Field[] => [
	{
		id: `fie-${createId()}`,
		name: 'Fruit plantation',
		type: 'Fruits',
		layers: [],
		center: changinCenter,
		area: '19',
		loraConfigId: ''
	},
	{
		id: `fie-${createId()}`,
		name: 'Fruit plantation',
		type: 'Fruits',
		layers: [],
		center: changinCenter,
		area: '19',
		loraConfigId: ''
	},
	{
		id: `fie-${createId()}`,
		name: 'Fruit plantation',
		type: 'Fruits',
		layers: [],
		center: changinCenter,
		area: '19',
		loraConfigId: ''
	}
];

const coords = [
	[6.231022451215551, 46.39905478450942],
	[6.231183970206132, 46.39895308179612],
	[6.231345489196656, 46.39888043688481],
	[6.231380602020721, 46.398492995723814],
	[6.231549143577183, 46.398420350199984],
	[6.231485940492831, 46.398183040814445],
	[6.231837068734308, 46.398725460750484],
	[6.232082858502565, 46.39853173996366],
	[6.230896045049036, 46.398434879312504],
	[6.230783684011016, 46.39888043688481],
	[6.230938180437818, 46.3987787338462],
	[6.23107160916922, 46.39870608870277],
	[6.231155879946897, 46.398609228360755],
	[6.230355307557744, 46.39780528088784],
	[6.230537894242701, 46.39793120115371],
	[6.230200811131965, 46.39795057347692],
	[6.230341262428112, 46.39802321962617],
	[6.229962043927429, 46.39810070874543],
	[6.230102495223605, 46.39822178527439],
	[6.229744344418435, 46.39825568665421],
	[6.229933953668194, 46.398386448922054],
	[6.230341262428112, 46.39861407138193],
	[6.2304887362890895, 46.398483309659554],
	[6.230594074761143, 46.398386448922054],
	[6.230720480927772, 46.39827505886183],
	[6.231029473780353, 46.39803774884439],
	[6.231148857382067, 46.39794573039683],
	[6.230924135308243, 46.397994161178076],
	[6.230973293261883, 46.39782949634616],
	[6.230783684011016, 46.3976745172269],
	[6.230706435798112, 46.397858554881964],
	[6.230207833696824, 46.3975679688273],
	[6.230313172168877, 46.39747110646496],
	[6.230011201881069, 46.39747110646496],
	[6.2301516531772165, 46.397335498869325],
	[6.229266810010415, 46.397296753780125],
	[6.229519622343474, 46.397214420373814],
	[6.2296179382518915, 46.397069125825],
	[6.229442374130599, 46.39787792723055],
	[6.229688163899937, 46.397737477547395],
	[6.2293019228344235, 46.397630929270406]
];

export const getDevices = (count: number = 30): Device[] =>
	new Array(count).fill({}).map((_, index) => ({
		name: `Device ${index.toString().padStart(3, '0')}`,
		id: `dev-${createId()}`,
		battery: Math.floor(Math.random() * 100),
		medias: [],
		firmwareVersion: 'v1.0.9',
		status: 'unactive',
		location: coords[index % coords.length] as [number, number]
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
			date: getRandomDateRange(new Date('2024-08-01'), new Date('2024-08-30')).toISOString(),
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

export const changinGeoJson: GeoJSONType = {
	type: 'FeatureCollection',
	features: [
		{
			id: createId(),
			type: 'Feature',
			properties: {
				layerName: 'Greenhouse Changin'
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
			}
		},
		{
			id: createId(),
			type: 'Feature',
			properties: {
				layerName: 'Barn Westfield'
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
			}
		},
		{
			id: createId(),
			type: 'Feature',
			properties: {
				layerName: 'Water Tower'
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
			}
		},
		{
			id: createId(),
			type: 'Feature',
			properties: {
				layerName: 'Farmhouse East'
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
			}
		},
		{
			id: createId(),
			type: 'Feature',
			properties: {
				layerName: 'Irrigation Control Center'
			},
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
			id: createId(),
			type: 'Feature',
			properties: {
				layerName: 'Storage Silo'
			},
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
			id: createId(),
			type: 'Feature',
			properties: {
				layerName: 'Machinery Garage'
			},
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
			id: createId(),
			type: 'Feature',
			properties: {
				layerName: 'Solar Panel Array'
			},
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
			id: createId(),
			type: 'Feature',
			properties: {
				layerName: 'Grain Processing Unit'
			},
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

export const features = getGeoJSONFeatures(changinGeoJson);

export const plantationMetrics: string[] = [
	'Soil Moisture Levels',
	'Crop Growth Rate',
	'Nutrient Levels',
	'Weather Conditions',
	'Pest and Disease Incidence',
	'Plant Health Index (NDVI)',
	'Irrigation Efficiency',
	'Yield Forecast',
	'Soil pH Levels',
	'Carbon Sequestration'
];

// Common company suffixes
const companySuffixes = [
	'Inc',
	'LLC',
	'Corp',
	'Solutions',
	'Technologies',
	'Group',
	'Labs',
	'Systems'
];

// Industry-related words for company names
const industryWords = [
	'Tech',
	'Data',
	'Cloud',
	'Digital',
	'Cyber',
	'Net',
	'Smart',
	'AI',
	'Web',
	'Soft',
	'Logic',
	'Code',
	'Dev',
	'Innovation',
	'Future',
	'Meta'
];

// Common words for company names
const baseWords = [
	'Blue',
	'Red',
	'Green',
	'Silver',
	'Gold',
	'Peak',
	'Summit',
	'Nova',
	'Alpha',
	'Beta',
	'Delta',
	'Omega',
	'First',
	'Prime',
	'Core',
	'Next'
];

export function generateCompanyName(): string {
	const useIndustryWord = Math.random() > 0.5;
	const firstWord = baseWords[Math.floor(Math.random() * baseWords.length)];
	const secondWord = useIndustryWord
		? industryWords[Math.floor(Math.random() * industryWords.length)]
		: baseWords[Math.floor(Math.random() * baseWords.length)];
	const suffix = companySuffixes[Math.floor(Math.random() * companySuffixes.length)];

	return `${firstWord}${secondWord} ${suffix}`;
}

export function generateEmail(companyName: string): string {
	// Convert company name to domain format
	const domain = companyName
		.toLowerCase()
		.replace(/[^\w\s]/g, '') // Remove special characters
		.replace(/\s+/g, '') // Remove spaces
		.replace(/(inc|llc|corp|solutions|technologies|group|labs|systems)$/i, ''); // Remove suffix

	// Common email prefixes
	const emailPrefixes = ['info', 'contact', 'support', 'hello', 'admin', 'sales'];
	const prefix = emailPrefixes[Math.floor(Math.random() * emailPrefixes.length)];

	return `${prefix}@${domain}.com`;
}

export function generateAccounts(count: number): Account[] {
	const list: Account[] = [];

	for (let i = 0; i < count; i++) {
		const organizationName = generateCompanyName();
		const email = generateEmail(organizationName);

		list.push({
			id: `acc-${createId()}`,
			email,
			organizationName
		});
	}

	return list;
}

export function generateRandomVersion(): string {
	const major = Math.floor(Math.random() * 5); // 0-4
	const minor = Math.floor(Math.random() * 10); // 0-9
	const patch = Math.floor(Math.random() * 10); // 0-9
	return `v${major}.${minor}.${patch}`;
}

export function getRandomDate(): Date {
	const today = new Date();
	const lastYear = new Date();
	lastYear.setFullYear(lastYear.getFullYear() - 1);
	return new Date(lastYear.getTime() + Math.random() * (today.getTime() - lastYear.getTime()));
}

export function generateRandomDevices(count: number): Device[] {
	const devices: Device[] = [];

	for (let i = 0; i < count; i++) {
		const device: Device = {
			id: createId(),
			name: `Device ${i.toString().padStart(3, '0')}`,
			battery: Math.floor(Math.random() * 100),
			firmwareVersion: generateRandomVersion(),
			status: 'unactive',
			creationDate: formatDateToDDMMYYYY(getRandomDate()),
			medias: [],
			location: undefined
		};

		devices.push(device);
	}

	return devices;
}

export const dummyProjects = [
  {
    name: "Golden Wheat Fields",
    description: "Large-scale wheat cultivation using precision agriculture techniques"
  },
  {
    name: "Sunrise Rice Paddy",
    description: "Traditional rice farming with modern water management systems"
  },
  {
    name: "Sweet Corn Valley",
    description: "Integrated corn plantation with automated irrigation"
  },
  {
    name: "Green Bean Haven",
    description: "Organic soybean and green bean cultivation project"
  },
  {
    name: "Potato Paradise",
    description: "Highland potato farm using terraced farming methods"
  },
  {
    name: "Sugarcane Plains",
    description: "Extended sugarcane plantation with efficient harvesting systems"
  },
  {
    name: "Tomato Gardens",
    description: "Greenhouse tomato production with hydroponic systems"
  },
  {
    name: "Cassava Fields",
    description: "Large-scale cassava cultivation for starch production"
  },
  {
    name: "Sunflower Meadows",
    description: "Sunflower plantation for oil production and bee farming"
  },
  {
    name: "Cotton Belt Project",
    description: "Sustainable cotton farming with drip irrigation"
  },
  {
    name: "Mango Grove",
    description: "High-density mango orchard with integrated pest management"
  },
  {
    name: "Banana Republic",
    description: "Export-quality banana plantation using organic methods"
  },
  {
    name: "Avocado Hills",
    description: "Water-efficient avocado orchard with soil moisture monitoring"
  },
  {
    name: "Berry Fields Forever",
    description: "Mixed berry cultivation using protective tunnels"
  },
  {
    name: "Citrus Valley",
    description: "Orange and lemon grove with frost protection systems"
  },
  {
    name: "Grape Escape",
    description: "Table grape vineyard with modern trellis systems"
  },
  {
    name: "Pineapple Point",
    description: "Tropical pineapple farm with rotation cropping"
  },
  {
    name: "Olive Grove",
    description: "High-density olive plantation for oil production"
  },
  {
    name: "Apple Acres",
    description: "Modern apple orchard with hail protection nets"
  },
  {
    name: "Pepper Plains",
    description: "Bell pepper greenhouse project with climate control"
  },
  {
    name: "Onion Fields",
    description: "Large-scale onion cultivation with storage facilities"
  },
  {
    name: "Carrot Canyon",
    description: "Organic carrot production with advanced sorting systems"
  },
  {
    name: "Lettuce Lands",
    description: "Hydroponic lettuce production in controlled environment"
  },
  {
    name: "Melon Matrix",
    description: "Cantaloupe and watermelon fields with drip irrigation"
  },
  {
    name: "Cabbage Creek",
    description: "Year-round cabbage production with crop rotation"
  },
  {
    name: "Strawberry Fields",
    description: "Vertical strawberry farming with automated fertigation"
  },
  {
    name: "Pumpkin Patch",
    description: "Mixed squash and pumpkin cultivation project"
  },
  {
    name: "Asparagus Valley",
    description: "Specialized asparagus farm with processing facility"
  },
  {
    name: "Broccoli Banks",
    description: "Cool-weather broccoli production with irrigation systems"
  },
  {
    name: "Sweet Potato Fields",
    description: "Large-scale sweet potato cultivation with storage facilities"
  }
];

export const dummyTrials = [
  {
    name: "Soil Moisture Network",
    description: "Grid of 20 moisture sensors monitoring irrigation efficiency"
  },
  {
    name: "Growth Rate Tracking",
    description: "Height sensors and time-lapse cameras monitoring plant development"
  },
  {
    name: "Water Level Control",
    description: "Automated water depth sensors across field sections"
  },
  {
    name: "Temperature Impact Study",
    description: "Thermal sensors monitoring day-night temperature effects"
  },
  {
    name: "Drought Resistance",
    description: "Soil moisture and plant stress sensors in different irrigation zones"
  },
  {
    name: "Growth Stage Monitor",
    description: "NDVI sensors tracking crop development stages"
  },
  {
    name: "Pest Detection Grid",
    description: "Network of insect traps with image recognition"
  },
  {
    name: "Nutrient Uptake Study",
    description: "NPK sensors monitoring soil nutrient levels"
  },
  {
    name: "Root Development",
    description: "Underground sensors tracking root system growth"
  },
  {
    name: "Soil Temperature Grid",
    description: "Temperature probes at different soil depths"
  },
  {
    name: "Yield Prediction Network",
    description: "Multi-sensor system estimating potential harvest yields"
  },
  {
    name: "Photosynthesis Monitor",
    description: "Chlorophyll fluorescence sensors tracking plant health"
  },
  {
    name: "Weather Impact Analysis",
    description: "Mini weather stations correlating climate with growth"
  },
  {
    name: "Irrigation Efficiency Study",
    description: "Water flow sensors measuring absorption rates"
  },
  {
    name: "Soil Compaction Monitor",
    description: "Pressure sensors tracking soil density changes"
  },
  {
    name: "Disease Early Warning",
    description: "Multispectral cameras detecting early signs of plant stress"
  },
  {
    name: "Pollinator Activity Tracking",
    description: "Camera system monitoring insect visitation patterns"
  },
  {
    name: "Leaf Area Index Study",
    description: "Optical sensors measuring canopy development"
  },
  {
    name: "Root Zone Monitor",
    description: "Soil probes tracking moisture at root depth"
  },
  {
    name: "Nutrient Leaching Control",
    description: "Deep soil sensors monitoring fertilizer movement"
  },
  {
    name: "Microclimate Analysis",
    description: "Environmental sensor network for local conditions"
  },
  {
    name: "Growth Pattern Study",
    description: "3D scanning system tracking plant architecture"
  },
  {
    name: "Soil Biology Monitor",
    description: "Chemical sensors tracking microbial activity"
  },
  {
    name: "Frost Risk Detection",
    description: "Temperature sensor array for frost prevention"
  },
  {
    name: "Harvest Timing Optimizer",
    description: "Multi-parameter system for optimal harvest scheduling"
  },
  {
    name: "Carbon Sequestration Study",
    description: "Soil carbon content monitoring system"
  },
  {
    name: "Water Stress Detection",
    description: "Infrared sensors monitoring plant water status"
  },
  {
    name: "Wind Impact Analysis",
    description: "Anemometers studying wind effects on growth"
  },
  {
    name: "Salinity Management",
    description: "Electrical conductivity sensors tracking soil salt levels"
  },
  {
    name: "Crop Quality Monitor",
    description: "Spectral sensors analyzing plant tissue development"
  }
];
