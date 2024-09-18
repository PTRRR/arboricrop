<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '../../../../components/Button.svelte';
	import Info from '../../../../components/Info.svelte';
	import Spacer from '../../../../components/Spacer.svelte';
	import Device from '../../../../components/wireframe/Device.svelte';
	import DeviceGeneralSettings from '../../../../components/wireframe/DeviceGeneralSettings.svelte';
	import SaveSection from '../../../../components/wireframe/SaveSection.svelte';
	import Section from '../../../../components/wireframe/Section.svelte';
	import { useDevices, useFields, useReturnButton } from '../../../../stores';

	let devices = useDevices();
	let fields = useFields();
	let returnButton = useReturnButton();

	let editMetadata: boolean = false;
	let editField: boolean = false;

	$: device = $devices.find((it) => it.id === $page.params.id);

	$: {
		returnButton.set({
			label: `Device ${device?.name || 'Unknown'}`,
			href: '/mobile-wireframe/devices'
		});
	}
</script>

{#if device}
	<Section
		title="Device:"
		buttons={[
			{ label: editMetadata ? 'Cancel' : 'Edit', onClick: () => (editMetadata = !editMetadata) }
		]}
	>
		<DeviceGeneralSettings {device} editable={editMetadata} />
		<Spacer />
		<Info label="Status:" value={device.status} />

		{#if $page.data.connected}
			<Spacer />
			<Button href={`/mobile-wireframe/devices/${device.id}/activation?connected=true`}>
				Activate
			</Button>
		{:else}
			<Spacer />
			<Button href={`/mobile-wireframe/devices/pairing?deviceId=${device.id}`}>Pair device</Button>
		{/if}
	</Section>
	<!-- <Section title="Location:" buttons={[{ label: 'Edit' }]}>
		<Info label="Field:" value={device.fieldId || '-'} />
	</Section> -->
	<!-- <Section title="Status:">
		<Info label="Health check:" value="healthy" />
		<Spacer />
		<Info label="Activity:" value={device.status} />
		<Spacer />
		<Button>Activate</Button>
	</Section> -->
	{#if $page.data.connected}
		<Section title="Advanced settings:">
			<Info label="Firmware version:" value={device.firmwareVersion} />
			<Spacer />
			<Button>Upgrate firmware</Button>
		</Section>
	{/if}

	{#if editMetadata}
		<Section title="Confirm changes:">
			<SaveSection onSave={() => {}} onCancel={() => {}} />
		</Section>
	{/if}

	<Section title="Danger zone:">
		<SaveSection
			deleteLabel="Permanently delete device"
			onDelete={() => {
				devices.set([...$devices.filter((it) => it.id !== device.id)]);
				goto('/mobile-wireframe/devices');
			}}
		/>
	</Section>
{:else}
	<span>Device unknown</span>
{/if}

<!-- <Device id={$page.params.id} /> -->
