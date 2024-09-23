import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ url }) => {
	const createMetric = url.searchParams.get('createMetric');
	return {
		createMetric
	};
};
