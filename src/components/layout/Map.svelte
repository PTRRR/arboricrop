<script lang="ts">
	import { MapLibre, GeoJSON, FillLayer, LineLayer, Marker } from 'svelte-maplibre';
	import type { LngLatLike, LngLatBoundsLike } from 'maplibre-gl';
	import type { GeoJSON as GeoJSONType } from 'geojson';
	import { getCss } from '../../utils/css';
	import { getGeoJSONFeatures } from '../../utils/geoJSON';

	let map: maplibregl.Map;

	export let showTarget: boolean = false;
	export let ratio: number = 1;
	export let center: LngLatLike | undefined = undefined;
	export let bounds: LngLatBoundsLike | undefined = undefined;
	export let maxBounds: LngLatBoundsLike | undefined = undefined;
	export let zoom: number = 1;
	export let maxZoom: number = zoom;
	export let minZoom: number = zoom;
	export let interactive: boolean = true;
	export let geoJSONs: GeoJSONType[] = [];
	export let markers: { lngLat: LngLatLike; label?: string }[] = [];
	export let mapStyle: string =
		'https://api.maptiler.com/maps/ch-swisstopo-lbm/style.json?key=epJVqnAFN0DeOXvikzSB';
	export let onChange: ((location: LngLatLike) => void) | undefined = undefined;
	export let onmoveend: (() => void) | undefined = undefined;
	export let onpointerup: (() => void) | undefined = undefined;
	export const getCenter = () => map.getCenter();

	$: features = geoJSONs.map(getGeoJSONFeatures).flat();

	let zoomLevel: number = zoom;
	$: showMarkerLabels = zoomLevel >= 15;
</script>

<div
	class="map"
	class:map--non-interactive={!interactive}
	style={getCss({
		'--ratio': ratio.toString()
	})}
>
	<div class="map__wrapper" on:pointerup={onpointerup}>
		{#if showTarget}
			<div class="map__target"></div>
		{/if}
		<MapLibre
			bind:map
			{center}
			{bounds}
			{maxBounds}
			{zoom}
			{maxZoom}
			{minZoom}
			style={mapStyle}
			class="map__inner"
			on:moveend={(event) => {
				const center = event.detail.map.getCenter();
				onChange?.([center.lng, center.lat]);
				onmoveend?.();
			}}
			on:zoom={(event) => (zoomLevel = event.detail.map.getZoom())}
		>
			{#each features as feature}
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
			{/each}

			{#each markers as marker}
				<Marker lngLat={marker.lngLat}>
					<div class="map__point">
						{#if marker.label && showMarkerLabels}
							<span class="map__label">{marker.label}</span>
						{/if}
					</div>
				</Marker>
			{/each}
		</MapLibre>
	</div>
</div>

<style>
	.map {
		width: 100%;
	}

	.map--non-interactive {
		pointer-events: none;
	}

	.map__wrapper {
		width: 100%;
		aspect-ratio: var(--ratio);
		/* border: solid 1px lightgray; */
		border-radius: 5px;
		position: relative;
		overflow: hidden;
		cursor: move;
		box-sizing: border-box;
	}

	.map__target {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 30px;
		height: 30px;
		border: solid 1px var(--black);
		border-radius: 100%;
		z-index: 1;
		pointer-events: none;
	}

	.map__target::before,
	.map__target::after {
		content: '';
		display: block;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.map__target::before {
		width: 150%;
		border-top: solid 1px var(--black);
	}

	.map__target::after {
		height: 150%;
		border-left: solid 1px var(--black);
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
