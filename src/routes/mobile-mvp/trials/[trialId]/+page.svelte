<script lang="ts">
	import { page } from '$app/stores';
	import Button from '../../../../components/layout/Button.svelte';
	import Section from '../../../../components/mobile-layout/Section.svelte';
	import Map from '../../../../components/layout/Map.svelte';
	import {
		useDevices,
		useFields,
		useGeoJSONFeatures,
		useGroups,
		useProjects,
		useReturnButton,
		useTrials
	} from '../../../../stores';
	import { swissBounds } from '../../../../utils/dummyData';
	import TextInput from '../../../../components/layout/TextInput.svelte';
	import Table, { type Cell, type Row } from '../../../../components/layout/Table.svelte';
	import { goto } from '$app/navigation';
	import { getLocationDelta } from '../../../../utils/locations';
	import { getFeatureLayerName } from '../../../../utils/geoJSON';
	import PageHeader from '../../../../components/layout/PageHeader.svelte';
	import type { LngLatLike } from 'svelte-maplibre';
	import SaveMenu from '../../../../components/mobile-layout/SaveMenu.svelte';
	import SubPage from '../../../../components/mobile-layout/SubPage.svelte';
	import type { GeoJSONFeature, Group } from '../../../../utils/types';
	import StatusDot from '../../../../components/mobile-layout/StatusDot.svelte';
	import type { PageData } from './$types';
	import ActionMenu from '../../../../components/mobile-layout/ActionMenu.svelte';
	import ActionButton from '../../../../components/mobile-layout/ActionButton.svelte';

	interface Prop {
		data: PageData;
	}

	const { data }: Prop = $props();

	const trialId = $page.params.trialId;
	const { devices, updateDevice } = useDevices();
	const { fields, getFieldById, deleteField, updateField } = useFields();
	const { groups } = useGroups();
	const { projects } = useProjects();
	const { trials } = useTrials();
	const returnButton = useReturnButton();
	const features = useGeoJSONFeatures();

	returnButton.set({
		label: '',
		backHref: data.baseUrl
	});

	const trial = $derived($trials.find((it) => it.id === trialId));
	const project = $derived($projects.find((it) => it.id === trial?.parentId));
	const trialGroups = $derived($groups.filter((it) => it.parentId === trial?.id));
	const trialDevices = $derived(
		$devices.filter((it) => trialGroups.map((it) => it.id).includes(it.parentId || ''))
	);
	let selectedFeaturesSet = $state<Set<GeoJSONFeature>>(new Set());
	const selectedFeatures = $derived(Array.from(selectedFeaturesSet));

	let map: Map | null = $state(null);
	let name = $state<string | undefined>(undefined);
	let area = $state<string | undefined>(undefined);
	let coords = $state<LngLatLike | undefined>(undefined);
	const hasChanged = $derived(Boolean(name || area || coords));

	const getGroupDevices = $derived((group: Group) => {
		const devices = trialDevices.filter((device) => device.parentId === group.id);
		return devices;
	});

	const devicesHeaders: Cell[] = [
		{ label: 'Name', width: '50%' },
		{ label: 'Status', width: '30%' },
		{ label: 'Battery', width: '20%' }
	];

	const groupHeaders: Cell[] = [
		{ label: 'Name', width: '70%' },
		{ label: 'Devices', width: '30%' }
	];

	const groupRows = $derived<Row[]>(
		trialGroups.map((it) => ({
			href: `${data.baseUrl}/groups/${it.id}`,
			cells: [{ label: it.name }, { label: getGroupDevices(it).length.toString() }]
		}))
	);

	const layersHeaders: Cell[] = [
		{ label: 'Layer name', width: '80%' },
		{ label: 'Type', width: '20%' }
	];

	const selectedLayersRows: Row[] = $derived(
		(trial?.layers || []).map((it) => ({
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

	const deviceMarkers = $derived(
		trialDevices.map((device) => ({
			lngLat: device.location as LngLatLike,
			label: device.name
		}))
	);
</script>

<div class="field">
	{#if trial}
		<Section>
			<PageHeader
				preTitle="Trial"
				title={trial.name}
				subTitle={project ? `${project.name}` : `Devices: ${$devices.length}`}
			/>
		</Section>
		<!-- <Section>
			<TextInput
				label="Name"
				defaultValue={trial.name}
				onvalue={(value) => {
					if (value !== trial.name) {
						name = value;
					}
				}}
			/>
			<TextInput
				label="Area"
				defaultValue={trial.area}
				onvalue={(value) => {
					if (value !== trial.area) {
						area = value;
					}
				}}
			/>
		</Section> -->

		<Section label="Groups">
			<Table headers={groupHeaders} rows={groupRows} />
		</Section>

		<!-- {#snippet statusCell(cell: Cell)}
			<div class="field__status-cell">
				<div class="field__status-dot">
					<StatusDot status={cell.label === 'active' ? 'success' : 'neutral'} />
				</div>
				<span>{cell.label}</span>
			</div>
		{/snippet}

		<Section
			label="Devices"
			actions={trialDevices.length > 0
				? [
						{
							icon: 'add',
							label: 'Add',
							iconOrder: 'inverted',
							onclick: () => goto(`${data.baseUrl}/devices/pairing?trial=${trial.id}`)
						}
					]
				: []}
		>
			{#if trialDevices.length === 0}
				<Button href={`${data.baseUrl}/devices/pairing?trial=${trial.id}`} icon="add">
					Add device
				</Button>
			{:else}
				<Table
					headers={devicesHeaders}
					rows={trialDevices.map((it) => ({
						href: `${data.baseUrl}/devices/${it.id}`,
						cells: [
							{ label: it.name || it.id },
							{ label: it.status || '', renderHandler: statusCell },
							{ label: `${it.battery || '0'}%` }
						]
					}))}
				/>
			{/if}
		</Section> -->

		<Section label="Location">
			<Map
				bind:this={map}
				maxBounds={swissBounds}
				zoom={14}
				minZoom={3}
				maxZoom={18}
				center={trial.center}
				geoJSONs={trial.layers}
				markers={deviceMarkers}
				onChange={(value) => {
					// const delta = getLocationDelta(value, trial.center);
					// if (delta > 0.000001) coords = value;
				}}
			/>
		</Section>

		<!-- {#snippet addLayer()}
			<SubPage icon="add">
				<PageHeader title="Available Layers" />
				<Section>
					<Table headers={layersHeaders} rows={availableLayersRows} />
				</Section>
			</SubPage>
		{/snippet} -->

		<!-- <Section label="Layers" actions={selectedLayersRows.length > 0 ? [{ label: addLayer }] : []}>
			{#if selectedLayersRows.length > 0}
				<Table headers={layersHeaders} rows={selectedLayersRows} />
			{:else}
				<SubPage label="Add layers" icon="add">
					<PageHeader title="LoRa configuration" />
				</SubPage>
			{/if}
		</Section> -->

		<!-- <Section label="LoRa">
			<SubPage label="Add configuration" icon="navigate">
				<PageHeader title="LoRa configuration" />
			</SubPage>
		</Section> -->

		<!-- <Section label="Danger Zone">
			<Button
				icon="cross"
				iconBackgroundColor="var(--red)"
				backgroundColor="var(--light-red)"
				padding
				onclick={() => {
					deleteField(trial.id);
					goto(data.baseUrl);
				}}
			>
				Delete Permanently
			</Button>
		</Section> -->

		{#if hasChanged}
			<SaveMenu
				oncancel={() => {
					name = undefined;
					area = undefined;
					coords = undefined;
				}}
				onsave={() => {
					updateField({
						...trial,
						name: name || trial.name,
						area: area || trial.area,
						center: coords || trial.center
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
