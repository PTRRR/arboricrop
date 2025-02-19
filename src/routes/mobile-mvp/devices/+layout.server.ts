import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ url }) => {
	const firmwareUpdate = url.searchParams.get('firmwareUpdate');
	const media = url.searchParams.get('media');
	const liveData = url.searchParams.get('liveData');
	const connected = url.searchParams.get('connected');
	const activation = url.searchParams.get('activation');
	const field = url.searchParams.get('field');
	const trial = url.searchParams.get('trial');
	const group = url.searchParams.get('group');
	const deviceId = url.searchParams.get('deviceId');
	const installationCheck = url.searchParams.get('installationCheck');
	return {
		firmwareUpdate: firmwareUpdate === 'true',
		connected: connected === 'true',
		activation: activation === 'true',
		installationCheck,
		media,
		liveData,
		deviceId,
		field,
		trial,
		group
	};
};
