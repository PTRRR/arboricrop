<script lang="ts">
	import { page } from '$app/stores';
	import Button from '../../../../components/mobile-layout/Button.svelte';
	import Section from '../../../../components/mobile-layout/Section.svelte';
	import Map from '../../../../components/mobile-layout/Map.svelte';
	import { useDevices, useFields, useReturnButton } from '../../../../stores';
	import { swissBounds } from '../../../../utils/dummyData';
	import TextInput from '../../../../components/mobile-layout/TextInput.svelte';
	import Table, { type Cell, type Row } from '../../../../components/mobile-layout/Table.svelte';
	import { goto } from '$app/navigation';
	import { getLocationDelta } from '../../../../utils/locations';
	import { getFeatureLayerName } from '../../../../utils/geoJSON';
	import PageHeader from '../../../../components/mobile-layout/PageHeader.svelte';
	import type { LngLatLike } from 'svelte-maplibre';
	import SaveMenu from '../../../../components/mobile-layout/SaveMenu.svelte';

	const fieldId = $page.params.fieldId;
	const { devices } = useDevices();
	const { fields, getFieldById, deleteField, updateField } = useFields();
	const returnButton = useReturnButton();

	returnButton.set({
		label: '',
		backHref: '/mobile-layout'
	});

	const field = $derived($fields && getFieldById(fieldId));
	const fieldDevices = $derived($devices.filter((it) => it.fieldId === field?.id));

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

	const devicesRows: Row[] = $derived(
		fieldDevices.map((it) => ({
			href: `/mobile-layout/devices/${it.id}`,
			cells: [
				{ label: it.name || it.id },
				{ label: it.status || '' },
				{ label: `${it.battery || '0'}%` }
			]
		}))
	);

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
</script>

<div class="field">
	{#if field}
		<PageHeader title={field.name} subTitle={`Devices: ${$devices.length}`} />
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
				<Table headers={devicesHeaders} rows={devicesRows} />
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
		<Section
			label="Layers"
			actions={selectedLayersRows.length > 0 ? [{ icon: 'add', onclick: () => {} }] : []}
		>
			{#if selectedLayersRows.length > 0}
				<Table headers={layersHeaders} rows={selectedLayersRows} />
			{:else}
				<Button icon="add">Add layer</Button>
			{/if}
		</Section>
		<Section label="LoRa"></Section>
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
