import { createId } from '@paralleldrive/cuid2';
import type { Device, Field, Notification } from './types';
import { shuffle } from './arrays';

export const getFields = (): Field[] => [
	{
		id: `fie-${createId()}`,
		name: 'Fruit plantation',
		type: 'Fruits'
	},
	{
		id: `fie-${createId()}`,
		name: 'Vignard',
		type: 'Wine'
	},
	{
		id: `fie-${createId()}`,
		name: 'Apples',
		type: 'Apples'
	}
];

export const getDevices = (count: number = 30): Device[] =>
	new Array(count).fill({}).map((_, index) => ({
		name: `Device ${index.toString().padStart(3, '0')}`,
		id: `dev-${createId()}`,
		battery: Math.floor(Math.random() * 100),
		medias: [],
		firmwareVersion: 'v1.0.9',
		status: 'active',
		location: {
			x: 40 + 20 * Math.random(),
			y: 40 + 20 * Math.random()
		}
	}));

export const getDevicesByFieldId = (devices: Device[], fieldId?: string) => {
	return devices.filter((it) => it.fieldId === fieldId);
};

export const dummyNotificationContents: Omit<Notification, 'id' | 'deviceId'>[] = [
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
			...randomContent
		};
	});
};
