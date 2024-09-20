import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ url }) => {
	const tab = url.searchParams.get('tab');
	return {
		tab
	};
};
