import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ url }) => {
	const network = url.searchParams.get('network');
	const organisation = url.searchParams.get('organisation');
	return { network: network === 'true', organisation: organisation === 'true' };
};
