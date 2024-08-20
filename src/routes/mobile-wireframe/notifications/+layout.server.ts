import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ url }) => {
	const acknowledge = url.searchParams.get('acknowledge');
	return { acknowledge: acknowledge === 'true' };
};
