import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ url }) => {
	const fieldId = url.searchParams.get('fieldId');
	return {
		fieldId
	};
};
