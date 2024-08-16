import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const firmwareUpdate = url.searchParams.get('firmwareUpdate');
	return { firmwareUpdate: firmwareUpdate === 'true' };
};
