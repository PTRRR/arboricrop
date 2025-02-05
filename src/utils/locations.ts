import type { LngLat } from 'maplibre-gl';
import type { LngLatLike } from 'svelte-maplibre';

export const getLocationDelta = (a: LngLatLike, b: LngLatLike) => {
	const aLng = Array.isArray(a) ? a[0] : (a as LngLat).lng;
	const aLat = Array.isArray(a) ? a[0] : (a as LngLat).lat;
	const bLng = Array.isArray(b) ? b[0] : (b as LngLat).lng;
	const bLat = Array.isArray(b) ? b[0] : (b as LngLat).lat;

	const deltaLat = Math.abs(aLat - bLat);
	const deltaLng = Math.abs(aLng - bLng);

	return deltaLat + deltaLng;
};
