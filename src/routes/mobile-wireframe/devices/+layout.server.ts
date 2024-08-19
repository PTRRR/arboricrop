import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ url }) => {
	const firmwareUpdate = url.searchParams.get('firmwareUpdate');
	const media = url.searchParams.get('media');
	const liveData = url.searchParams.get('liveData');
	return { firmwareUpdate: firmwareUpdate === 'true', media, liveData };
};
