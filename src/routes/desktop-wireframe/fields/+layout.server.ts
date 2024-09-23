import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ url }) => {
	const createMetric = url.searchParams.get('createMetric') === 'true';
	const editMap = url.searchParams.get('editMap') === 'true';
	return {
		createMetric,
		editMap
	};
};
