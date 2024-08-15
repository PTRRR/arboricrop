import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const strategy = url.searchParams.get('strategy');
	return { strategy };
};
