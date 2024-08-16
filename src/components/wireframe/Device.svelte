<script lang="ts">
	import { page } from '$app/stores';
	import { useDevices, useReturnButton } from '../../stores';
	import type { Device } from '../../utils/types';
	import Spacer from '../Spacer.svelte';
	import Button from './Button.svelte';
	import DeviceForm from './DeviceForm.svelte';

	export let id: string | undefined = undefined;
	let device: Device | undefined = undefined;
	const devices = useDevices();

	let returnButton = useReturnButton();

	devices.subscribe((devices) => {
		device = devices.find((it) => it.id === id);
		returnButton.set({
			label: device ? `${device?.name || ''}` : 'New device',
			href: '/mobile-wireframe/devices'
		});
	});
</script>

<div class="device">
	{#if !id}
		<DeviceForm
			{device}
			onUpdate={(device) => {
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
		{#if !$page.data.firmwareUpdate}
			<Spacer size="5rem" />
			<div class="device__footer">
				<p>New device detected</p>
				<Button>Save new device to account</Button>
				<Button href="/mobile-wireframe/devices">Cancel</Button>
			</div>
		{/if}
	{:else}
		<DeviceForm
			{device}
			onUpdate={(device) => {
				const deviceIndex = $devices.findIndex((it) => it.id === device.id);

				if (deviceIndex > -1) {
					const updatedDevices = [...$devices];
					updatedDevices[deviceIndex] = device;
					devices.set(updatedDevices);
				}
			}}
		/>
	{/if}
</div>

<style>
	.device {
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
	}

	.device__footer {
		width: 100%;
		display: flex;
		flex-direction: column;
		text-align: center;
		gap: 1rem;
	}
</style>
