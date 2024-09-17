<script lang="ts">
	import { MapLibre } from 'svelte-maplibre';
	import { changinGeoJson } from '../../utils/dummyData';

	let map: maplibregl.Map | undefined;

	const onLoad = () => {
		if (map) {
			for (const feature of changinGeoJson.features) {
				map.addSource('test' + feature.id, {
					type: 'geojson',
					data: feature
				});

				map.addLayer({
					id: 'test' + feature.id,
					type: 'fill',
					source: 'test' + feature.id,
					layout: {},
					paint: {
						'fill-color': 'black',
						'fill-opacity': 0.3
					}
				});

				map.addLayer({
					id: 'test' + feature.id + 'lines',
					type: 'line',
					source: 'test' + feature.id,
					layout: {
						'line-join': 'round',
						'line-cap': 'round'
					},
					paint: {
						'line-color': 'black',
						'line-width': 2
					}
				});
			}
		}
	};
</script>

<div class="map-system">
	<MapLibre
		bind:map
		center={[6.232215714715601, 46.399095324739115]}
		maxBounds={[
			[6.02197061006523, 45.84425061226135],
			[10.476417711659073, 47.881756658719695]
		]}
		zoom={15}
		class="map-system__map"
		standardControls
		style="https://api.maptiler.com/maps/ch-swisstopo-lbm-grey/style.json?key=epJVqnAFN0DeOXvikzSB"
		on:load={onLoad}
	/>
</div>

<style>
	:global(.map-system__map) {
		width: 100%;
		height: 100svh;
	}
</style>
