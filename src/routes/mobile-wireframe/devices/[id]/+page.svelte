<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Portal from 'svelte-portal';
	import Button from '../../../../components/Button.svelte';
	import Info from '../../../../components/Info.svelte';
	import MapV2 from '../../../../components/MapV2.svelte';
	import Spacer from '../../../../components/Spacer.svelte';
	import ButtonList from '../../../../components/wireframe/ButtonList.svelte';
	import DeviceGeneralSettings from '../../../../components/wireframe/DeviceGeneralSettings.svelte';
	import SaveSection from '../../../../components/wireframe/SaveSection.svelte';
	import Section from '../../../../components/wireframe/Section.svelte';
	import {
		useDeviceIllustration,
		useDevices,
		useFields,
		useReturnButton
	} from '../../../../stores';
	import { getCss } from '../../../../utils/css';
	import { swissBounds } from '../../../../utils/dummyData';
	import type { Device } from '../../../../utils/types';
	import { onMount } from 'svelte';

	const { setVisibility, reset, setUsb, setJack } = useDeviceIllustration();
	const { devices } = useDevices();
	const { fields } = useFields();
	const returnButton = useReturnButton();

	let map: MapV2 | undefined = undefined;
	let editMetadata: boolean = false;
	let editField: boolean = false;
	let editLocation: boolean = false;

	$: device = $devices.find((it) => it.id === $page.params.id);
	$: field = $fields.find((it) => it.id === device?.fieldId);

	$: {
		returnButton.set({
			label: `Device ${device?.name || 'Unknown'}`,
			href: '/mobile-wireframe/devices'
		});
	}

	$: updateDevice = (device: Device) => {
		const deviceIndex = $devices.findIndex((it) => it.id === device?.id);
		const newDevices = [...$devices];
		newDevices[deviceIndex] = {
			...newDevices[deviceIndex],
			...device
		};
		devices.set(newDevices);
	};

	$: {
		if ($page.data.connected) {
			setVisibility(true);
			setUsb(true);
			setJack(device?.status === 'active');
		} else {
			reset();
		}
	}

	onMount(() => {
		return () => reset();
	});
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
			{#if device.status === 'unactive'}
				<Spacer />
				<Button href={`/mobile-wireframe/devices/${device.id}/activation?connected=true`}>
					Activate
				</Button>
			{:else if editMetadata}
				<Spacer />
				<Button
					on:click={() => {
						updateDevice({ ...device, status: 'unactive' });
						editMetadata = false;
					}}
				>
					Disactivate
				</Button>
			{/if}
		{:else}
			<Spacer />
			<Button href={`/mobile-wireframe/devices/pairing?deviceId=${device.id}`}>Pair device</Button>
		{/if}
	</Section>
	{#if device.status === 'active'}
		<Section
			title="Location:"
			buttons={[
				{ label: editLocation ? 'Cancel' : 'Edit', onClick: () => (editLocation = !editLocation) }
			]}
		>
			<MapV2
				bind:this={map}
				maxBounds={swissBounds}
				zoom={15}
				minZoom={8}
				maxZoom={18.5}
				center={device?.location || field?.center}
				markers={device?.location ? [{ lngLat: device.location }] : []}
				showTarget={editLocation}
				geoJSONs={field?.layers}
			/>

			{#if editLocation}
				<Spacer />
				<Button
					on:click={() => {
						if (map && device) {
							const { lng, lat } = map.getCenter();
							updateDevice({ ...device, location: [lng, lat] });
						}
						editLocation = false;
					}}
				>
					Validate location
				</Button>
			{/if}
		</Section>

		<Section
			title="Field:"
			buttons={[{ label: editField ? 'Cancel' : 'Edit', onClick: () => (editField = !editField) }]}
		>
			{#if editField}
				<ButtonList
					items={$fields}
					let:item
					onSelect={(field) => {
						updateDevice({ ...device, fieldId: field.id });
						editField = false;
					}}
				>
					{item.name}
				</ButtonList>
			{:else}
				<div style={getCss({ display: 'flex', justifyContent: 'flex-start' })}>
					<Button minimal href={`/mobile-wireframe/fields/${field?.id}`}>
						{field?.name || '-'}
					</Button>
				</div>
			{/if}
		</Section>
	{/if}

	<Section title="Metadata:" buttons={[{ label: 'Edit' }]}>
		<textarea
			placeholder="Your note..."
			value={device?.note || ''}
			on:input={(event) => {
				if (device) {
					updateDevice({
						...device,
						note: event.currentTarget.value
					});
				}
			}}
		/>
		{#if device.medias.length > 0}
			<Spacer />
			<ButtonList
				items={device.medias}
				let:item
				onSelect={(media) => {
					if (device) {
						updateDevice({
							...device,
							medias: (device.medias || []).filter((it) => it !== media)
						});
					}
				}}
			>
				<span>{item.name}</span>
				<span>{item.type}</span>
			</ButtonList>
		{:else}
			<Spacer />
			<span>No medias</span>
		{/if}
	</Section>

	{#if $page.data.connected}
		<Section title="Troubleshooting:">
			<Button>See live data</Button>
		</Section>

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

<style>
	textarea {
		font-family: inherit;
		font-size: inherit;
		padding: 1rem;
		border: solid 1px var(--black);
		background-color: var(--white);
		outline: none;
		max-width: 100%;
		resize: vertical;
	}
</style>
