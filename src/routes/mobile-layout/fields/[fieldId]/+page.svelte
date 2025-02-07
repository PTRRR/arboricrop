<script lang="ts">
	import { page } from '$app/stores';
	import Button from '../../../../components/mobile-layout/Button.svelte';
	import Section from '../../../../components/mobile-layout/Section.svelte';
	import Map from '../../../../components/mobile-layout/Map.svelte';
	import { useDevices, useFields, useGeoJSONFeatures, useReturnButton } from '../../../../stores';
	import { swissBounds } from '../../../../utils/dummyData';
	import TextInput from '../../../../components/mobile-layout/TextInput.svelte';
	import Table, { type Cell, type Row } from '../../../../components/mobile-layout/Table.svelte';
	import { goto } from '$app/navigation';
	import { getLocationDelta } from '../../../../utils/locations';
	import { getFeatureLayerName } from '../../../../utils/geoJSON';
	import PageHeader from '../../../../components/mobile-layout/PageHeader.svelte';
	import type { LngLatLike } from 'svelte-maplibre';
	import SaveMenu from '../../../../components/mobile-layout/SaveMenu.svelte';
	import SubPage from '../../../../components/mobile-layout/SubPage.svelte';
	import type { GeoJSONFeature } from '../../../../utils/types';
	import StatusDot from '../../../../components/mobile-layout/StatusDot.svelte';

	const fieldId = $page.params.fieldId;
	const { devices } = useDevices();
	const { fields, getFieldById, deleteField, updateField } = useFields();
	const returnButton = useReturnButton();
	const features = useGeoJSONFeatures();

	returnButton.set({
		label: '',
		backHref: '/mobile-layout'
	});

	const field = $derived($fields && getFieldById(fieldId));
	const fieldDevices = $derived($devices.filter((it) => it.fieldId === field?.id));
	let selectedFeaturesSet = $state<Set<GeoJSONFeature>>(new Set());
	const selectedFeatures = $derived(Array.from(selectedFeaturesSet));

	let map: Map | null = $state(null);
	let name = $state<string | undefined>(undefined);
	let area = $state<string | undefined>(undefined);
	let coords = $state<LngLatLike | undefined>(undefined);
	const hasChanged = $derived(name || area || coords);

	const devicesHeaders: Cell[] = [
		{ label: 'Name', width: '50%' },
		{ label: 'Status', width: '30%' },
		{ label: 'Battery', width: '20%' }
	];

	const layersHeaders: Cell[] = [
		{ label: 'Layer name', width: '80%' },
		{ label: 'Type', width: '20%' }
	];

	const selectedLayersRows: Row[] = $derived(
		(field?.layers || []).map((it) => ({
			cells: [
				{
					label: getFeatureLayerName(it) as string
				},
				{ label: 'GeoJSON' }
			]
		}))
	);

	const availableLayersRows: Row[] = $derived(
		$features.map((it) => ({
			onclick: () => {
				if (selectedFeaturesSet.has(it)) {
					selectedFeaturesSet.delete(it);
				} else {
					selectedFeaturesSet.add(it);
				}
				selectedFeaturesSet = new Set(selectedFeaturesSet);
			},
			selected: selectedFeaturesSet.has(it),
			cells: [
				{
					label: getFeatureLayerName(it) as string
				},
				{ label: 'GeoJSON' }
			]
		}))
	);
</script>

<div class="field">
	{#if field}
		{#snippet fieldHeaderTitle()}
			<span>{field.name}</span>
			<Button
				padding
				icon="navigate"
				backgroundColor="var(--grey)"
				iconOrder="inverted"
				onclick={() => {
					const randomDeviceIndex = Math.floor(Math.random() * $devices.length);
					const device = $devices[randomDeviceIndex];
					goto(`/mobile-layout/devices/pairing?deviceId=${device?.id}`);
				}}
			>
				pair device
			</Button>
		{/snippet}
		<PageHeader title={fieldHeaderTitle} subTitle={`Devices: ${$devices.length}`} />
		<Section>
			<TextInput
				label="Name"
				defaultValue={field.name}
				onvalue={(value) => {
					if (value !== field.name) {
						name = value;
					}
				}}
			/>
			<TextInput
				label="Area"
				defaultValue={field.area}
				onvalue={(value) => {
					if (value !== field.area) {
						area = value;
					}
				}}
			/>
		</Section>

		{#snippet statusCell(cell: Cell)}
			<div class="field__status-cell">
				<div class="field__status-dot">
					<StatusDot status={cell.label === 'active' ? 'success' : 'neutral'} />
				</div>
				<span>{cell.label}</span>
			</div>
		{/snippet}

		<Section
			label="Devices"
			actions={fieldDevices.length > 0
				? [
						{
							icon: 'add',
							onclick: () => goto(`/mobile-layout/devices/pairing?field=${field.id}`)
						}
					]
				: []}
		>
			{#if fieldDevices.length === 0}
				<Button href={`/mobile-layout/devices/pairing?field=${field.id}`} icon="add">
					Add device
				</Button>
			{:else}
				<Table
					headers={devicesHeaders}
					rows={fieldDevices.map((it) => ({
						href: `/mobile-layout/devices/${it.id}`,
						cells: [
							{ label: it.name || it.id },
							{ label: it.status || '', renderHandler: statusCell },
							{ label: `${it.battery || '0'}%` }
						]
					}))}
				/>
			{/if}
		</Section>
		<Section label="Location">
			<Map
				bind:this={map}
				maxBounds={swissBounds}
				zoom={14}
				minZoom={3}
				maxZoom={18}
				center={field.center}
				showTarget
				markers={[{ lngLat: field.center }]}
				geoJSONs={field.layers}
				onChange={(value) => {
					const delta = getLocationDelta(value, field.center);
					if (delta > 0.000001) coords = value;
				}}
			/>
		</Section>

		{#snippet addLayer()}
			<SubPage icon="add">
				<PageHeader title="Available Layers" />
				<Section>
					<Table headers={layersHeaders} rows={availableLayersRows} />
				</Section>
			</SubPage>
		{/snippet}

		<Section label="Layers" actions={selectedLayersRows.length > 0 ? [{ label: addLayer }] : []}>
			{#if selectedLayersRows.length > 0}
				<Table headers={layersHeaders} rows={selectedLayersRows} />
			{:else}
				<SubPage label="Add layers" icon="add">
					<PageHeader title="LoRa configuration" />
				</SubPage>
			{/if}
		</Section>
		<Section label="LoRa">
			<SubPage label="Add configuration" icon="navigate">
				<PageHeader title="LoRa configuration" />
			</SubPage>
		</Section>
		<Section label="Danger Zone">
			<Button
				icon="cross"
				iconBackgroundColor="var(--red)"
				backgroundColor="var(--light-red)"
				padding
				onclick={() => {
					deleteField(field.id);
					goto('/mobile-layout');
				}}
			>
				Delete Permanently
			</Button>
		</Section>

		{#if hasChanged}
			<SaveMenu
				oncancel={() => {
					name = undefined;
					area = undefined;
					coords = undefined;
				}}
				onsave={() => {
					updateField({
						...field,
						name: name || field.name,
						area: area || field.area,
						center: coords || field.center
					});

					name = undefined;
					area = undefined;
					coords = undefined;
				}}
			/>
		{/if}
	{/if}
</div>

<style lang="scss">
	.field {
		&__status-cell {
			display: flex;
			align-items: center;
			gap: 0.3rem;
		}

		&__status-dot {
			display: block;
			transform: translate(0, 10%);
		}
	}
</style>
