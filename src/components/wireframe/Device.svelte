<script lang="ts">
	import { onMount } from 'svelte';
	import { useDevices, useReturnButton } from '../../stores';
	import type { Device } from '../../utils/types';
	import DeviceForm from './DeviceForm.svelte';

	let device: Device;
	export let isNewDevice: boolean | undefined = undefined;
	export let id: string | undefined = undefined;
	const devices = useDevices();

	let returnButton = useReturnButton();

	$: {
		let newDevice = $devices.find((it) => it.id === id);

		if (newDevice) {
			device = newDevice;
			returnButton.set({
				label: device ? `${device?.name || ''}` : 'New device',
				href: '/mobile-wireframe/devices'
			});
		}
	}
</script>

<div class="device">
	<DeviceForm
		{device}
		{isNewDevice}
		onSave={(device) => {
			const deviceIndex = $devices.findIndex((it) => it.id === device.id);

			if (deviceIndex > -1) {
				const updatedDevices = [...$devices];
				updatedDevices[deviceIndex] = device;
				devices.set(updatedDevices);
			} else {
				const updatedDevices = [...$devices, device];
				devices.set(updatedDevices);
			}
		}}
	/>
</div>

<style>
	.device {
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
		gap: var(--gap);
	}
</style>
