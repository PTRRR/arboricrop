import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ url }) => {
	const network = url.searchParams.get('network');
	return { network: network === 'true' };
};
