<script lang="ts">
	import { MapLibre, GeoJSON, FillLayer, LineLayer, Marker } from 'svelte-maplibre';
	import type { LngLatLike, LngLatBoundsLike } from 'maplibre-gl';
	import type { GeoJSON as GeoJSONType, Feature, Geometry, GeoJsonProperties } from 'geojson';
	import { getCss } from '../utils/css';
	import { onMount } from 'svelte';
	import Button from './Button.svelte';
	import { getGeoJSONFeatures } from '../utils/geoJSON';
	import Separation from './Separation.svelte';
	import Spacer from './Spacer.svelte';
	import ButtonList from './wireframe/ButtonList.svelte';

	export let ratio: number = 1;
	export let center: LngLatLike | undefined = undefined;
	export let maxBounds: LngLatBoundsLike | undefined = undefined;
	export let zoom: number = 1;
	export let geoJSONs: GeoJSONType[] = [];
	export let markers: { lngLat: LngLatLike; label?: string }[] = [];
	export let mapStyle: string =
		'https://api.maptiler.com/maps/ch-swisstopo-lbm-grey/style.json?key=epJVqnAFN0DeOXvikzSB';

	$: features = geoJSONs.map(getGeoJSONFeatures).flat();
	let selectedFeature: Feature<Geometry, GeoJsonProperties> | undefined = undefined;

	$: {
		if (features.length && !selectedFeature) {
			selectedFeature = features[0];
		}
	}
</script>

<div
	class="map"
	style={getCss({
		'--ratio': ratio.toString()
	})}
>
	<div class="map__wrapper">
		<MapLibre
			{center}
			{maxBounds}
			{zoom}
			maxZoom={zoom + 2}
			minZoom={zoom - 2}
			style={mapStyle}
			class="map__inner"
		>
			{#each features as feature}
				{#if feature === selectedFeature}
					<GeoJSON data={feature}>
						<FillLayer
							paint={{
								'fill-color': 'black',
								'fill-opacity': 0.3
							}}
						/>

						<LineLayer
							layout={{
								'line-join': 'round',
								'line-cap': 'round'
							}}
							paint={{
								'line-color': 'black',
								'line-width': 1.5
							}}
						/>
					</GeoJSON>
				{/if}
			{/each}

			{#each markers as marker}
				<Marker lngLat={marker.lngLat}>
					<div class="map__point">
						{#if marker.label}
							<span class="map__label">{marker.label}</span>
						{/if}
					</div>
				</Marker>
			{/each}
		</MapLibre>
	</div>

	{#if features.length > 0}
		<Spacer />
		<Separation title="Layers: " />
		<ButtonList items={features} let:item>
			{#if item.properties && item.properties['layerName']}
				<Button
					minimal
					selected={selectedFeature === item}
					on:click={() => (selectedFeature = item)}
				>
					{item.properties['layerName']}
				</Button>
			{/if}
		</ButtonList>
	{/if}
</div>

<style>
	.map__wrapper {
		width: 100%;
		aspect-ratio: var(--ratio);
		border: solid 1px var(--black);
		position: relative;
		overflow: hidden;
		cursor: move;
		box-sizing: border-box;
	}

	:global(.map__inner) {
		width: 100%;
		height: 100%;
	}

	:global(.maplibregl-ctrl-attrib) {
		display: none;
	}

	.map__point {
		position: relative;
		display: block;
		width: 8px;
		height: 8px;
		background-color: black;
		border-radius: 100%;
	}

	.map__label {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translate(-50%, 100%);
		white-space: nowrap;
	}
</style>
