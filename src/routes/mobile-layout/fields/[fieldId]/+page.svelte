<script lang="ts">
	import { page } from '$app/stores';
	import Button from '../../../../components/mobile-layout/Button.svelte';
	import Section from '../../../../components/mobile-layout/Section.svelte';
	import Map from '../../../../components/mobile-layout/Map.svelte';
	import { useDevices, useFields } from '../../../../stores';
	import { swissBounds } from '../../../../utils/dummyData';
	import TextInput from '../../../../components/mobile-layout/TextInput.svelte';
	import Table, { type Cell, type Row } from '../../../../components/mobile-layout/Table.svelte';
	import { goto } from '$app/navigation';
	import { getLocationDelta } from '../../../../utils/locations';
	import { getFeatureLayerName } from '../../../../utils/geoJSON';
	import PageHeader from '../../../../components/mobile-layout/PageHeader.svelte';

	const fieldId = $page.params.fieldId;
	const { devices } = useDevices();
	const { fields, getFieldById, deleteField, updateField } = useFields();

	let map: Map | null = $state(null);
	let mapUpdated = $state(false);

	const field = $derived($fields && getFieldById(fieldId));
	const fieldDevices = $derived($devices.filter((it) => it.fieldId === field?.id));

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
			<TextInput label="Name" defaultValue={field.name} />
			<TextInput label="Area" defaultValue={field.area} />
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
				onChange={(e) => {
					const delta = getLocationDelta(e, field.center);
					if (delta > 0.000001) mapUpdated = true;
				}}
			/>
			{#if mapUpdated}
				<Button
					onclick={() => {
						updateField({ ...field, center: map?.getCenter() });
						mapUpdated = false;
					}}
				>
					Set location
				</Button>
			{/if}
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
				onclick={() => {
					deleteField(field.id);
					goto('/mobile-layout');
				}}
				icon="cross"
				iconBackgroundColor="var(--red)"
				iconSize="large"
				backgroundColor="var(--light-red)"
				>Delete Permanently
			</Button>
		</Section>
	{/if}
</div>
