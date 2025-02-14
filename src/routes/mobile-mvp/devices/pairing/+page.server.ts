import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const strategy = url.searchParams.get('strategy');
	const success = url.searchParams.get('success');
	return { strategy, success: success === 'true' };
};
