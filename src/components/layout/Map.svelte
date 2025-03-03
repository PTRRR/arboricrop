<script module lang="ts">
	export interface Marker {
		lngLat: LngLatLike;
		label?: string;
		notificationType?: NotificationType;
		status?: Status;
		battery?: string;
	}
</script>

<script lang="ts">
	import {
		MapLibre,
		GeoJSON,
		FillLayer,
		LineLayer,
		Marker as MarkerElement
	} from 'svelte-maplibre';
	import type { LngLatLike, LngLatBoundsLike } from 'maplibre-gl';
	import type { GeoJSON as GeoJSONType } from 'geojson';
	import { getCss } from '../../utils/css';
	import { getGeoJSONFeatures } from '../../utils/geoJSON';
	import { changinCenter, swissBounds } from '../../utils/dummyData';
	import type { Status, NotificationType } from '../../utils/types';
	import Stack from '../desktop/Stack.svelte';

	let map = $state<maplibregl.Map | undefined>(undefined);

	interface Props {
		showTarget?: boolean;
		ratio?: number;
		center?: LngLatLike;
		bounds?: LngLatBoundsLike;
		maxBounds: LngLatBoundsLike;
		zoom?: number;
		maxZoom?: number;
		minZoom?: number;
		interactive?: boolean;
		geoJSONs?: GeoJSONType[];
		markers?: Marker[];
		mapStyle?: string;
		onChange?: (location: LngLatLike) => void;
		onmoveend?: () => void;
		onpointerup?: () => {};
	}

	const {
		showTarget = false,
		ratio = 1,
		center = changinCenter,
		bounds,
		maxBounds,
		zoom = 1,
		maxZoom = zoom,
		minZoom = zoom,
		interactive = true,
		geoJSONs = [],
		markers = [],
		mapStyle = 'https://api.maptiler.com/maps/ch-swisstopo-lbm/style.json?key=epJVqnAFN0DeOXvikzSB',
		onChange,
		onmoveend,
		onpointerup
	}: Props = $props();

	export const getCenter = () => map?.getCenter();

	const features = $derived(geoJSONs.map(getGeoJSONFeatures).flat());

	let zoomLevel = $state(zoom);
	const showMarkerLabels = $derived(zoomLevel >= 15);
</script>

<div
	class="map"
	class:map--non-interactive={!interactive}
	style={getCss({
		'--ratio': ratio.toString()
	})}
>
	<div class="map__wrapper" {onpointerup}>
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
				<MarkerElement lngLat={marker.lngLat}>
					<div
						class="map__point"
						class:map__point--red={marker.notificationType === 'alert'}
						class:map__point--yellow={marker.notificationType === 'warning'}
						class:map__point--green={marker.status === 'active'}
						class:map__point--grey={marker.status === 'unactive'}
					>
						{#if marker.label && showMarkerLabels}
							<div class="map__legend">
								<Stack>
									<span class="map__label">{marker.label}</span>
									{#if marker.battery}
										<span class="map__battery">Battery {marker.battery}%</span>
									{/if}
								</Stack>
							</div>
						{/if}
					</div>
				</MarkerElement>
			{/each}
		</MapLibre>
	</div>
</div>

<style lang="scss">
	.map {
		width: 100%;

		&__point {
			position: relative;
			display: block;
			width: 6px;
			height: 6px;
			background-color: black;
			border-radius: 100%;

			display: block;
			width: 14px;
			height: 14px;
			background-color: var(--dark-grey);
			border: solid 1px var(--grey);

			&::after {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				content: '';
				display: block;
				width: 8px;
				height: 8px;
				background-color: var(--grey);
				border-radius: 100%;
			}

			&--green {
				background-color: var(--light-green);

				&::after {
					background-color: var(--green);
				}
			}

			&--yellow {
				background-color: var(--light-yellow);

				&::after {
					background-color: var(--yellow);
				}
			}

			&--red {
				background-color: var(--light-red);

				&::after {
					background-color: var(--red);
				}
			}
		}

		&__legend {
			position: absolute;
			top: 100%;
			right: 0;
			transform: translate(100%, 0);
			background-color: var(--light-grey);
			padding: 0.2rem 0.5rem;
			border: solid 1px var(--grey);
			border-radius: 5px;
			box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
			text-transform: lowercase;
		}

		&__label {
			white-space: nowrap;
			font-family: Rubik;
			font-weight: 500;
			font-size: var(--main-font-size);
		}

		&__battery {
			white-space: nowrap;
			white-space: nowrap;
			font-family: Rubik;
			font-weight: 500;
			font-size: var(--small-font-size);
			color: var(--dark-grey);
		}
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
</style>
