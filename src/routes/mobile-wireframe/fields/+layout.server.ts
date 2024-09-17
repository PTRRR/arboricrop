import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ url }) => {
	const devices = url.searchParams.get('devices');
	const addLayer = url.searchParams.get('addLayer');
	return {
		devices: devices === 'true',
		addLayer: addLayer === 'true'
	};
};
