<script lang="ts">
	import Section from '../../../../components/mobile-layout/Section.svelte';
	import TextInput from '../../../../components/mobile-layout/TextInput.svelte';
	import Map from '../../../../components/mobile-layout/Map.svelte';
	import { changinCenter, swissBounds } from '../../../../utils/dummyData';
	import type { Field, GeoJSONFeature } from '../../../../utils/types';
	import { createId } from '@paralleldrive/cuid2';
	import {
		useFields,
		useGeoJSONFeatures,
		useLoRaConfigurations,
		useReturnButton
	} from '../../../../stores';
	import Button from '../../../../components/mobile-layout/Button.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getFeatureLayerName } from '../../../../utils/geoJSON';
	import Table, { type Cell, type Row } from '../../../../components/mobile-layout/Table.svelte';
	import { createUrlBuilder } from '../../../../utils/urls';
	import PageHeader from '../../../../components/mobile-layout/PageHeader.svelte';
	import SaveMenu from '../../../../components/mobile-layout/SaveMenu.svelte';

	const defaultName = $page.url.searchParams.get('name') || '';
	const addLayer = $derived($page.url.searchParams.get('addLayer') === 'true');

	const { fields } = useFields();
	const { loRaConfigurations } = useLoRaConfigurations();
	const features = useGeoJSONFeatures();
	const defaultLoRaConfiguration = $derived($loRaConfigurations.find((it) => it.isDefault));
	const url = createUrlBuilder();

	let map: Map | null = $state(null);
	let name = $state('');
	let area = $state('');

	let selectedFeaturesSet = $state<Set<GeoJSONFeature>>(new Set());
	const selectedFeatures = $derived(Array.from(selectedFeaturesSet));

	let field: Field = $state({
		id: `fie-${createId()}`,
		name: defaultName,
		area: '',
		type: '',
		loraConfigId: '',
		center: changinCenter,
		// svelte-ignore state_referenced_locally
		layers: selectedFeatures
	});

	const layersHeaders: Cell[] = [
		{ label: 'Layer name', width: '80%' },
		{ label: 'Type', width: '20%' }
	];

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

	const selectedLayersRows: Row[] = $derived(
		selectedFeatures.map((it) => ({
			cells: [
				{
					label: getFeatureLayerName(it) as string
				},
				{ label: 'GeoJSON' }
			]
		}))
	);
</script>

<PageHeader title="New Field" />

<Section hidden={!addLayer} actions={[{ label: 'Import', onclick: () => {} }]}>
	<Table headers={layersHeaders} rows={availableLayersRows} />
</Section>

<Section hidden={addLayer}>
	<TextInput label="Name" defaultValue={defaultName} onvalue={(value) => (name = value)} />
	<TextInput label="Area" onvalue={(value) => (area = value)} />
</Section>

<Section hidden={addLayer} label="Location">
	<Map
		bind:this={map}
		maxBounds={swissBounds}
		zoom={11}
		minZoom={3}
		maxZoom={18}
		center={field.center}
		showTarget
		markers={[{ lngLat: field.center }]}
		geoJSONs={selectedFeatures}
	/>
	<Button
		icon="check"
		onclick={() => {
			field.center = map?.getCenter() || field.center;
		}}
	>
		Validate Location
	</Button>
</Section>

<Section
	hidden={addLayer}
	label="Layers"
	actions={selectedFeaturesSet.size > 0
		? [{ icon: 'add', onclick: () => goto(url.addQuery({ name: 'addLayer', value: 'true' })) }]
		: []}
>
	{#if selectedFeaturesSet.size > 0}
		<Table headers={layersHeaders} rows={selectedLayersRows} />
	{:else}
		<Button href={url.addQuery({ name: 'addLayer', value: 'true' })} icon="add">Add layer</Button>
	{/if}
</Section>

{#if addLayer}
	<SaveMenu
		onsave={() => goto(url.removeQuery({ name: 'addLayer' }))}
		oncancel={() => goto(url.removeQuery({ name: 'addLayer' }))}
	/>
{:else}
	<SaveMenu
		onsave={() => {
			field = {
				...field,
				name,
				area,
				// ...generalSettings.getValues(),
				layers: selectedFeatures
			};
			fields.set([...$fields, field]);
			goto(`/mobile-layout`);
		}}
		oncancel={() => goto('/mobile-layout')}
	/>
{/if}
