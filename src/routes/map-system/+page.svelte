<script lang="ts">
	import { changinGeoJson } from '../../utils/dummyData';
	import type { LngLatLike } from 'maplibre-gl';
	import MapV2 from '../../components/MapV2.svelte';

	const markers: { lngLat: LngLatLike; label?: string }[] = [
		{ lngLat: [6.230671662475515, 46.39865299101902], label: 'Device 01' },
		{ lngLat: [6.230971662475515, 46.39815299101902], label: 'Device 02' }
	];
</script>

<div class="map-system">
	<div class="map-system__map">
		<MapV2
			center={[6.231351138336578, 46.398638192299046]}
			maxBounds={[
				[6.02197061006523, 45.84425061226135],
				[10.476417711659073, 47.881756658719695]
			]}
			zoom={17}
			geoJSONs={[changinGeoJson]}
			{markers}
		/>
	</div>
</div>

<style>
	.map-system {
		width: 100%;
		height: 100svh;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.map-system__map {
		width: 50%;
	}
</style>
