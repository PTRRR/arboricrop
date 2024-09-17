import type { GeoJSON, Feature, GeoJsonProperties, Geometry } from 'geojson';
import { filterNotEmpty } from './arrays';
import type { GeoJSONFeature } from './types';

export const getGeoJSONFeatures = (geoJSON: GeoJSON): Feature<Geometry, GeoJsonProperties>[] => {
	return (
		geoJSON.type === 'FeatureCollection'
			? geoJSON.features
			: geoJSON.type === 'Feature'
				? [geoJSON]
				: []
	)
		.filter(filterNotEmpty)
		.flat();
};

export const getFeatureLayerName = (feature: GeoJSONFeature): string | undefined => {
	return feature.properties?.['layerName'];
};
