<script lang="ts">
	import { goto } from '$app/navigation';
	import Spacer from '../../../../components/Spacer.svelte';
	import Separation from '../../../../components/Separation.svelte';
	import {
		useFields,
		useGeoJSONFeatures,
		useLoRaConfigurations,
		useReturnButton
	} from '../../../../stores';
	import Button from '../../../../components/Button.svelte';
	import type { Field, GeoJSONFeature } from '../../../../utils/types';
	import { createUrlBuilder } from '../../../../utils/urls';
	import { page } from '$app/stores';
	import CenteredWrapper from '../../../../components/wireframe/CenteredWrapper.svelte';
	import ButtonList from '../../../../components/wireframe/ButtonList.svelte';
	import { createId } from '@paralleldrive/cuid2';
	import { getCss } from '../../../../utils/css';
	import { changinCenter, swissBounds } from '../../../../utils/dummyData';
	import { getFeatureLayerName } from '../../../../utils/geoJSON';
	import FieldGeneralSettings from '../../../../components/wireframe/FieldGeneralSettings.svelte';
	import MapV2 from '../../../../components/MapV2.svelte';
	import SaveSection from '../../../../components/wireframe/SaveSection.svelte';
	import Section from '../../../../components/wireframe/Section.svelte';
	import Info from '../../../../components/Info.svelte';

	let map: MapV2;
	let generalSettings: FieldGeneralSettings;

	const { fields } = useFields();
	const features = useGeoJSONFeatures();
	const returnButton = useReturnButton();
	const { loRaConfigurations } = useLoRaConfigurations();
	const url = createUrlBuilder();

	const defaultLoRaConfiguration = $loRaConfigurations.find((it) => it.isDefault);

	let field: Field = $state({
		id: `fie-${createId()}`,
		name: '',
		type: '',
		loraConfigId: defaultLoRaConfiguration?.id as string,
		center: changinCenter,
		layers: []
	});

	const loraConfiguration = $derived.by(() =>
		$loRaConfigurations.find((it) => it.id === field.loraConfigId)
	);

	let selectedLoraConfiguration = $state<string | undefined>(defaultLoRaConfiguration?.id);
	let selectedFeatures: GeoJSONFeature[] = $state([]);

	$effect(() => {
		returnButton.set({
			label: `New field`,
			href: $page.data.addLayer ? url.resetQueries([]) : '/mobile-wireframe/fields'
		});
	});
</script>

{#if $page.data.addLayer}
	<Section title="Available layers:" buttons={[{ label: 'Create new layer' }]}>
		<ButtonList items={$features} let:item>
			{#if getFeatureLayerName(item)}
				<div class="layer__button">
					<Button
						minimal
						selected={selectedFeatures.includes(item)}
						on:click={() =>
							selectedFeatures.includes(item)
								? (selectedFeatures = selectedFeatures.filter((it) => it !== item))
								: (selectedFeatures = [...selectedFeatures, item])}
					>
						{getFeatureLayerName(item)}
					</Button>
					<div>GeoJSON</div>
				</div>
			{/if}
		</ButtonList>
	</Section>
	<Section title="Confirm Changes:">
		<SaveSection
			saveLabel="Save"
			onSave={() => goto(url.resetQueries([]))}
			onCancel={() => {
				selectedFeatures = [];
				goto(url.resetQueries([]));
			}}
		/>
	</Section>
{/if}

{#if $page.data.setLoraConfig}
	<Section title="Available LoRa Configurations:" buttons={[{ label: 'Create new' }]}>
		<ButtonList items={$loRaConfigurations} let:item>
			<Button
				minimal
				selected={item.id === selectedLoraConfiguration}
				on:click={() => (selectedLoraConfiguration = item.id)}
			>
				{item.name}
			</Button>
		</ButtonList>
	</Section>
	<Section title="Confirm Changes:">
		<SaveSection
			saveLabel="Save"
			onSave={() => {
				field.loraConfigId = selectedLoraConfiguration as string;
				goto(url.resetQueries([]));
			}}
			onCancel={() => {
				selectedFeatures = [];
				goto(url.resetQueries([]));
			}}
		/>
	</Section>
{/if}

<div
	class="field__form"
	style={getCss({
		display: $page.data.addLayer || $page.data.setLoraConfig ? 'none' : undefined
	})}
>
	<Section title="General settings:">
		<FieldGeneralSettings bind:this={generalSettings} {field} editable />
	</Section>

	<Section title="Map:">
		<MapV2
			bind:this={map}
			maxBounds={swissBounds}
			zoom={9}
			minZoom={3}
			maxZoom={18}
			center={field.center}
			showTarget
			markers={[{ lngLat: field.center }]}
			geoJSONs={selectedFeatures}
		/>
		<Spacer />
		<Button href={url.addQuery({ name: 'addLayer', value: true })}>Manage layers</Button>
		<Spacer />
		<Button
			on:click={() => {
				const { lng, lat } = map.getCenter();
				field = {
					...field,
					center: [lng, lat]
				};
			}}
		>
			Set field location
		</Button>
	</Section>

	<Section title="LoRa Settings">
		<Info label="Selected configuration:" value={loraConfiguration?.name} />
		<Spacer />
		<Button href={url.addQuery({ name: 'setLoraConfig', value: true })}>
			Change LoRa configuration
		</Button>
	</Section>

	<Section title="Confirm Changes:">
		<SaveSection
			onSave={() => {
				field = {
					...field,
					...generalSettings.getValues(),
					layers: selectedFeatures
				};
				fields.set([...$fields, field]);
				goto(`/mobile-wireframe/fields/${field.id}`);
			}}
			onCancel={() => goto('/mobile-wireframe/fields')}
		/>
	</Section>
</div>

<style>
	.layer__button {
		width: 100%;
		display: flex;
		justify-content: space-between;
		text-decoration: none !important;
	}

	.layer__button div {
		color: var(--dark-gray);
		text-decoration: none !important;
	}
</style>
