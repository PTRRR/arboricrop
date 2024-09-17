<script lang="ts">
	import { MapLibre, GeoJSON, FillLayer, LineLayer, Marker } from 'svelte-maplibre';
	import type { LngLatLike, LngLatBoundsLike } from 'maplibre-gl';
	import type { GeoJSON as GeoJSONType } from 'geojson';
	import { getCss } from '../utils/css';

	export let ratio: number = 1;
	export let center: LngLatLike | undefined = undefined;
	export let maxBounds: LngLatBoundsLike | undefined = undefined;
	export let zoom: number = 1;
	export let geoJSONs: GeoJSONType[] = [];
	export let markers: { lngLat: LngLatLike; label?: string }[] = [];
	export let mapStyle: string =
		'https://api.maptiler.com/maps/ch-swisstopo-lbm-grey/style.json?key=epJVqnAFN0DeOXvikzSB';
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
			{#each geoJSONs as geoJSON}
				<GeoJSON data={geoJSON}>
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
							'line-width': 2
						}}
					/>
				</GeoJSON>
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
