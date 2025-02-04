<script lang="ts">
	import { page } from '$app/stores';
	import Button from '../../../../components/mobile-layout/Button.svelte';
	import Info from '../../../../components/Info.svelte';
	import MapV2 from '../../../../components/MapV2.svelte';
	import Spacer from '../../../../components/Spacer.svelte';
	import ButtonList from '../../../../components/wireframe/ButtonList.svelte';
	import DeviceGeneralSettings from '../../../../components/wireframe/DeviceGeneralSettings.svelte';
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
	import { getCss } from '../../../../utils/css';
	import { swissBounds } from '../../../../utils/dummyData';
	import type { Device } from '../../../../utils/types';
	import { onMount } from 'svelte';
	import TextInput from '../../../../components/mobile-layout/TextInput.svelte';
	import TextareaInput from '../../../../components/mobile-layout/TextareaInput.svelte';

	const { preventNavigationHistory, navigateToPreviousPage } = useNavigationHistory();
	const { setVisibility, reset, setUsb, setJack, setBlink, setOn } = useDeviceIllustration();
	const { loRaConfigurations } = useLoRaConfigurations();
	const { devices } = useDevices();
	const { fields } = useFields();
	const returnButton = useReturnButton();
	const { userMode } = useUserMode();

	let map: MapV2 | undefined = undefined;
	let editMetadata: boolean = false;
	let editField: boolean = false;
	let editLocation: boolean = false;

	$: device = $devices.find((it) => it.id === $page.params.id);
	$: field = $fields.find((it) => it.id === device?.fieldId);
	$: loraConfiguration = $loRaConfigurations.find((it) => it.id === field?.loraConfigId);

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
			setBlink(device?.status !== 'active');
			setOn(device?.status === 'active');
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
	{#if $page.data.connected}
		{#if device.status === 'unactive'}
			<Button
				preventHistory
				href={`/mobile-wireframe/devices/${device.id}/activation?connected=true&advanced=${$userMode === 'advanced'}`}
			>
				Activate
			</Button>
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
		<Spacer />
		<Button preventHistory href={`/mobile-wireframe/devices/pairing?deviceId=${device.id}`}>
			Pair device
		</Button>
	{/if}
	<Spacer />
	<Section
		label="Device:"
		buttons={[
			{ label: editMetadata ? 'Cancel' : 'Edit', onClick: () => (editMetadata = !editMetadata) }
		]}
	>
		<TextInput label="Id:" defaultValue={device.id} readonly />
		<TextInput label="Name:" defaultValue={device.name} readonly />
	</Section>
	{#if device.status === 'active'}
		<Section
			label="Location:"
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

		<Section
			label="Field:"
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
					<Button href={`/mobile-wireframe/fields/${field?.id}`}>
						{field?.name || '-'}
					</Button>
				</div>
			{/if}
		</Section>
	{/if}

	<Section label="Metadata:" buttons={[{ label: 'Edit' }]}>
		<!-- svelte-ignore element_invalid_self_closing_tag -->
		<TextareaInput
			label="Notes"
			onvalue={(value) => {
				if (device) {
					updateDevice({
						...device,
						note: value
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

	<Section label="Advanced settings:">
		<Info label="LoRa Configuration:" value={loraConfiguration?.name} />
		<Spacer />
		{#if $page.data.connected}
			<Info label="Firmware version:" value={device.firmwareVersion} />
			<Spacer />
			<Button>Upgrate firmware</Button>
			<Spacer />
			<Info label="Troubleshooting:" />
			<Spacer />
			<Button>See live data</Button>
		{/if}
	</Section>

	{#if editMetadata}
		<Section label="Confirm changes:">
			<SaveSection onSave={() => {}} onCancel={() => {}} />
		</Section>
	{/if}

	<Section label="Danger zone:">
		<Button
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
