<script lang="ts">
	import Section from '../../../../components/mobile-layout/Section.svelte';
	import TextInput from '../../../../components/layout/TextInput.svelte';
	import Map from '../../../../components/layout/Map.svelte';
	import { changinCenter, swissBounds } from '../../../../utils/dummyData';
	import type { GeoJSONFeature, Trial } from '../../../../utils/types';
	import { createId } from '@paralleldrive/cuid2';
	import {
		useCurrentAccount,
		useGeoJSONFeatures,
		useLoRaConfigurations,
		useReturnButton,
		useTrials
	} from '../../../../stores';
	import Button from '../../../../components/layout/Button.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getFeatureLayerName } from '../../../../utils/geoJSON';
	import Table, { type Cell, type Row } from '../../../../components/layout/Table.svelte';
	import { createUrlBuilder } from '../../../../utils/urls';
	import PageHeader from '../../../../components/layout/PageHeader.svelte';
	import SaveMenu from '../../../../components/mobile-layout/SaveMenu.svelte';
	import type { PageData } from './$types';
	import ActionMenu from '../../../../components/mobile-layout/ActionMenu.svelte';
	import ActionButton from '../../../../components/mobile-layout/ActionButton.svelte';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();
	const defaultName = $page.url.searchParams.get('name') || '';
	const addLayer = $derived($page.url.searchParams.get('addLayer') === 'true');

	const { trials, addTrial } = useTrials();
	const { loRaConfigurations } = useLoRaConfigurations();
	const features = useGeoJSONFeatures();
	const defaultLoRaConfiguration = $derived($loRaConfigurations.find((it) => it.isDefault));
	const url = createUrlBuilder();
	const returnButton = useReturnButton();
	const { currentAccount } = useCurrentAccount();

	let map: Map | null = $state(null);
	let name = $state('');
	let area = $state('');

	let selectedFeaturesSet = $state<Set<GeoJSONFeature>>(new Set());
	const selectedFeatures = $derived(Array.from(selectedFeaturesSet));

	let trial: Trial = $state({
		id: `fie-${createId()}`,
		name: defaultName,
		area: '',
		type: '',
		loraConfigId: '',
		center: changinCenter,
		// svelte-ignore state_referenced_locally
		layers: selectedFeatures,
		accountId: $currentAccount?.id || ''
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

	returnButton.set({
		label: '',
		backHref: data.baseUrl
	});
</script>

<PageHeader title="New Trial" />

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
		center={trial.center}
		showTarget
		markers={[{ lngLat: trial.center }]}
		geoJSONs={selectedFeatures}
	/>
	<Button
		icon="check"
		onclick={() => {
			trial.center = map?.getCenter() || trial.center;
		}}
	>
		Validate Location
	</Button>
</Section>

{#if name}
	<ActionMenu>
		<ActionButton
			icon="check"
			color="var(--white)"
			backgroundColor="var(--green)"
			iconBackgroundColor="var(--green)"
			onclick={() => {
				addTrial({
					...trial,
					name,
					area,
					// ...generalSettings.getValues(),
					layers: selectedFeatures
				});

				name = '';

				setTimeout(() => {
					goto(data.baseUrl);
				}, 300);
			}}
		>
			Save
		</ActionButton>
	</ActionMenu>
{/if}
