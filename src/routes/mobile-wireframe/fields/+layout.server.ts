import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ url }) => {
	const devices = url.searchParams.get('devices');
	return { devices: devices === 'true' };
};
