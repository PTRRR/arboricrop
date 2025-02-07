<script lang="ts">
	import { page } from '$app/stores';
	import Button from '../../../../components/mobile-layout/Button.svelte';
	import Map from '../../../../components/mobile-layout/Map.svelte';
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
	import type { LngLatLike } from 'svelte-maplibre';
	import SaveMenu from '../../../../components/mobile-layout/SaveMenu.svelte';
	import { getLocationDelta } from '../../../../utils/locations';
	import type { IconName } from '../../../../components/mobile-layout/Icon.svelte';
	import { addEllipsis } from '../../../../utils/strings';
	import LiveData from '../../../../components/mobile-layout/LiveData.svelte';

	const { preventNavigationHistory, navigateToPreviousPage } = useNavigationHistory();
	const { setVisibility, reset, setUsb, setJack, setBlink, setOn } = useDeviceIllustration();
	const { loRaConfigurations } = useLoRaConfigurations();
	const { devices } = useDevices();
	const { fields } = useFields();
	const returnButton = useReturnButton();
	const { userMode } = useUserMode();

	let map: Map | undefined = $state(undefined);
	let location = $state<LngLatLike | undefined>(undefined);
	let name = $state<string | undefined>(undefined);
	let notes = $state<string | undefined>(undefined);
	let isTerminalVisible = $state(false);

	const hasChanged = $derived(location || name || notes);
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
	const actionButtonIcon = $derived<IconName>(
		$page.data.connected ? (device?.status === 'active' ? 'cross' : 'check') : 'navigate'
	);
	const actionButtonIconBackgroundColor = $derived(
		$page.data.connected
			? device?.status === 'active'
				? 'var(--red)'
				: 'var(--green)'
			: 'var(--black)'
	);
	const actionButtonBackgroundColor = $derived(
		$page.data.connected
			? device?.status === 'active'
				? 'var(--light-red)'
				: 'var(--light-green)'
			: 'var(--grey)'
	);
	const actionButtonLink = $derived(
		$page.data.connected && device?.status === 'unactive'
			? `/mobile-layout/devices/${device?.id}/activation?connected=true&advanced=${$userMode === 'advanced'}`
			: `/mobile-layout/devices/pairing?deviceId=${device?.id}`
	);

	$effect(() => {
		returnButton.set({
			label: 'Field',
			backHref: `/mobile-layout/fields/${device?.fieldId}`
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
		<span>{addEllipsis(device.name || '', 8)}</span>
		<Button
			padding
			icon={actionButtonIcon}
			iconBackgroundColor={actionButtonIconBackgroundColor}
			backgroundColor={actionButtonBackgroundColor}
			iconOrder="inverted"
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
			color="var(--white)"
			fontSize="var(--big-font-size)"
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

	<Section>
		<TextInput label="Id:" defaultValue={device.id} readonly />
		<TextInput
			label="Name:"
			defaultValue={device.name}
			onvalue={(value) => (name = value !== device.name ? value : undefined)}
		/>
		<TextareaInput
			label="Notes"
			defaultValue={device.note}
			onvalue={(value) => (notes = value !== device.note ? value : undefined)}
		/>
	</Section>

	{#if device.status === 'active'}
		<Section label="Location">
			<Map
				bind:this={map}
				maxBounds={swissBounds}
				zoom={15}
				minZoom={8}
				maxZoom={18.5}
				center={device?.location || field?.center}
				markers={device?.location ? [{ lngLat: device.location }] : []}
				showTarget
				geoJSONs={field?.layers}
				onChange={(value) => {
					if (device.location) {
						const delta = getLocationDelta(value, device.location);
						if (delta > 0.0002) {
							location = value;
						}
					}
				}}
			/>
		</Section>
	{/if}

	<Section
		label="Medias"
		actions={device.medias.length > 0 ? [{ icon: 'add', onclick: () => {} }] : []}
	>
		{#if device.medias.length > 0}
			<Table
				headers={[
					{ label: 'Name', width: '60%' },
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
			<Dropdown label="Add media" icon="add" items={mediaOptions} renderItem={mediaOptionItem} />
		{/if}
	</Section>

	{#if $page.data.connected}
		<Section label="Advanced">
			<Button icon="warning">Upgrate firmware</Button>
			<LiveData bind:opened={isTerminalVisible} subTitle={`ID: ${device.id}`} />
		</Section>
	{/if}

	<Section label="Danger zone">
		<Button
			padding
			icon="cross"
			iconBackgroundColor="var(--red)"
			backgroundColor="var(--light-red)"
			onclick={() => {
				$preventNavigationHistory = true;
				devices.set([...$devices.filter((it) => it.id !== device.id)]);
				navigateToPreviousPage();
			}}
			>Delete Permanently
		</Button>
	</Section>

	{#if hasChanged && !isTerminalVisible}
		<SaveMenu
			onsave={() => {
				updateDevice({
					...device,
					location: location || device.location,
					name: name || device.name,
					note: notes || device.note
				});

				name = undefined;
				notes = undefined;
				location = undefined;
			}}
			oncancel={() => {
				updateDevice(device);
				name = undefined;
				notes = undefined;
				location = undefined;
			}}
		/>
	{/if}
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
			background-color: var(--red);
			border-radius: 100%;
			transform: translate(0, 30%);
		}

		&__status--active {
			background-color: var(--green);
		}
	}
</style>
