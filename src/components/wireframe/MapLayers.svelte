<script lang="ts">
	import type { GeoJSON as GeoJSONType, Feature, Geometry, GeoJsonProperties } from 'geojson';
	import { getGeoJSONFeatures } from '../../utils/geoJSON';
	import ButtonList from './ButtonList.svelte';

	export let geoJSONs: GeoJSONType[] = [];
	export let onSelect:
		| ((selectedFeature: Feature<Geometry, GeoJsonProperties> | undefined | null) => void)
		| undefined = undefined;

	$: features = geoJSONs.map(getGeoJSONFeatures).flat();
	let selectedFeature: Feature<Geometry, GeoJsonProperties> | undefined | null = undefined;
</script>

<ButtonList
	items={features}
	let:item
	selectedItems={[selectedFeature]}
	onSelect={(item) => {
		selectedFeature === item ? (selectedFeature = null) : (selectedFeature = item);
		onSelect?.(selectedFeature);
	}}
>
	{#if item?.properties && item.properties['layerName']}
		{item.properties['layerName']}
	{/if}
</ButtonList>
