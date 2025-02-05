<script lang="ts">
	import { page } from '$app/stores';
	import Button from '../../../../components/mobile-layout/Button.svelte';
	import Map from '../../../../components/mobile-layout/Map.svelte';
	import Spacer from '../../../../components/Spacer.svelte';
	import SaveSection from '../../../../components/wireframe/SaveSection.svelte';
	import Section from '../../../../components/mobile-layout/Section.svelte';
	import {
		useDeviceIllustration,
		useDevices,
		useFields,
		useLoRaConfigurations,
		useNavigationHistory,
		useReturnButton,
		useUserMode
	} from '../../../../stores';
	import { swissBounds } from '../../../../utils/dummyData';
	import type { Device, MediaType } from '../../../../utils/types';
	import { onMount } from 'svelte';
	import TextInput from '../../../../components/mobile-layout/TextInput.svelte';
	import TextareaInput from '../../../../components/mobile-layout/TextareaInput.svelte';
	import PageHeader from '../../../../components/mobile-layout/PageHeader.svelte';
	import { goto } from '$app/navigation';
	import Table from '../../../../components/mobile-layout/Table.svelte';
	import Dropdown from '../../../../components/mobile-layout/Dropdown.svelte';
	import { createId } from '@paralleldrive/cuid2';

	const { preventNavigationHistory, navigateToPreviousPage } = useNavigationHistory();
	const { setVisibility, reset, setUsb, setJack, setBlink, setOn } = useDeviceIllustration();
	const { loRaConfigurations } = useLoRaConfigurations();
	const { devices } = useDevices();
	const { fields } = useFields();
	const returnButton = useReturnButton();
	const { userMode } = useUserMode();

	let map: Map | undefined = $state(undefined);
	let editMetadata: boolean = $state(false);
	let editField: boolean = $state(false);
	let editLocation: boolean = $state(false);

	const device = $derived($devices.find((it) => it.id === $page.params.id));
	const field = $derived($fields.find((it) => it.id === device?.fieldId));
	const loraConfiguration = $derived(
		$loRaConfigurations.find((it) => it.id === field?.loraConfigId)
	);

	const mediaOptions: { label: string; type: MediaType }[] = [
		{ label: 'Image', type: 'image' },
		{ label: 'Audio note', type: 'audio-note' },
		{ label: 'File', type: 'file' }
	];

	const actionButtonLabel = $derived(
		$page.data.connected ? (device?.status === 'active' ? 'Deactivate' : 'Activate') : 'Pair'
	);
	const actionButtonLink = $derived(
		$page.data.connected && device?.status === 'unactive'
			? `/mobile-layout/devices/${device?.id}/activation?connected=true&advanced=${$userMode === 'advanced'}`
			: `/mobile-layout/devices/pairing?deviceId=${device?.id}`
	);

	$effect(() => {
		returnButton.set({
			label: `Device ${device?.name || 'Unknown'}`,
			href: '/mobile-wireframe/devices'
		});
	});

	const updateDevice = $derived((device: Device) => {
		const deviceIndex = $devices.findIndex((it) => it.id === device?.id);
		const newDevices = [...$devices];
		newDevices[deviceIndex] = {
			...newDevices[deviceIndex],
			...device
		};
		devices.set(newDevices);
	});

	$effect(() => {
		if ($page.data.connected) {
			setVisibility(true);
			setUsb(true);
			setBlink(device?.status !== 'active');
			setOn(device?.status === 'active');
			setJack(device?.status === 'active');
		} else {
			reset();
		}
	});

	onMount(() => {
		return () => reset();
	});
</script>

{#if device}
	{#snippet deviceName()}
		<span>{device.name}</span>
		<Button
			onclick={() => {
				if ($page.data.connected && device.status === 'active') {
					updateDevice({ ...device, status: 'unactive' });
				} else {
					goto(actionButtonLink);
				}
			}}
		>
			{actionButtonLabel}
		</Button>
	{/snippet}

	{#snippet deviceStatus()}
		<div class="device__status">
			<span class="device__status-dot" class:device__status--active={device.status === 'active'}
			></span>
			<span>{device.status}</span>
		</div>
	{/snippet}

	{#snippet mediaOptionItem(item: { label: string; type: MediaType })}
		<Button
			onclick={() => {
				const medias =
					item.type === 'image'
						? [...device.medias, { name: `${createId()}.jpg`, type: item.type }]
						: item.type === 'audio-note'
							? [...device.medias, { name: `${createId()}.mp3`, type: item.type }]
							: [...device.medias, { name: `${createId()}.pdf`, type: item.type }];

				if (device) {
					updateDevice({
						...device,
						medias
					});
				}
			}}
		>
			{item.label}
		</Button>
	{/snippet}

	<PageHeader title={deviceName} subTitle={deviceStatus} />
	<!-- <div class="device__header">
		<div class="device__name">
			<h1>{device.name}</h1>
			<Button href={actionButtonLink}>{actionButtonLabel}</Button>
		</div>
		<div class="device__status">
			<span class="device__status-dot" class:device__status--active={device.status === 'active'}
			></span>
			<h2>{device.status}</h2>
		</div>
	</div> -->
	{#if $page.data.connected}
		{#if device.status === 'unactive'}
			<!-- <Button
				preventHistory
				href={`/mobile-wireframe/devices/${device.id}/activation?connected=true&advanced=${$userMode === 'advanced'}`}
			>
				Activate
			</Button> -->
		{:else if editMetadata}
			<Spacer />
			<Button
				onclick={() => {
					updateDevice({ ...device, status: 'unactive' });
					editMetadata = false;
				}}
			>
				Disactivate
			</Button>
		{/if}
	{:else}
		<!-- <Button preventHistory href={`/mobile-wireframe/devices/pairing?deviceId=${device.id}`}>
			Pair device
		</Button> -->
	{/if}
	<Spacer />
	<Section>
		<TextInput label="Id:" defaultValue={device.id} readonly />
		<TextInput label="Name:" defaultValue={device.name} />
		<TextareaInput
			label="Notes"
			defaultValue={device.note}
			onvalue={(value) => {
				if (device) {
					updateDevice({
						...device,
						note: value
					});
				}
			}}
		/>
	</Section>
	{#if device.status === 'active'}
		<Section
			label="Location"
			actions={[
				{ label: editLocation ? 'Cancel' : 'Edit', onclick: () => (editLocation = !editLocation) }
			]}
		>
			<Button href={`/mobile-layout/fields/${field?.id}`}>
				{field?.name || '-'}
			</Button>

			<Map
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
				<Button
					onclick={() => {
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
	{/if}

	<Section
		label="Medias"
		actions={device.medias.length > 0 ? [{ label: 'Add', onclick: () => {} }] : []}
	>
		{#if device.medias.length > 0}
			<Table
				headers={[
					{ label: 'Name', width: '50%' },
					{ label: 'Type', width: '30%' }
				]}
				rows={device.medias.map((it) => ({
					cells: [
						{ label: it.name.length > 25 ? `${it.name.slice(0, 25)}...` : it.name },
						{ label: it.type }
					]
				}))}
			/>
		{:else}
			<Dropdown label="Add media" items={mediaOptions} renderItem={mediaOptionItem} />
		{/if}
	</Section>

	<Section label="Advanced">
		{#if $page.data.connected}
			<Button>Upgrate firmware</Button>
			<Button>See live data</Button>
		{/if}
	</Section>

	{#if editMetadata}
		<Section label="Confirm changes:">
			<SaveSection onSave={() => {}} onCancel={() => {}} />
		</Section>
	{/if}

	<Section label="Danger zone">
		<Button
			type="error"
			onclick={() => {
				$preventNavigationHistory = true;
				devices.set([...$devices.filter((it) => it.id !== device.id)]);
				navigateToPreviousPage();
			}}>Permanently delete device</Button
		>
	</Section>
{:else}
	<span>Device unknown</span>
{/if}

<style lang="scss">
	.device {
		&__status {
			display: flex;
			font-weight: normal;
			align-items: center;
			gap: 0.5rem;
		}

		&__status-dot {
			display: block;
			width: 10px;
			height: 10px;
			background-color: var(--danger-red);
			border-radius: 100%;
			transform: translate(0, 30%);
		}

		&__status--active {
			background-color: var(--accent-color);
		}
	}
</style>
