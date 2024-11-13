import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const step = url.searchParams.get('step') || '0';
	const selectField = url.searchParams.get('selectField') === 'true';
	const advanced = url.searchParams.get('advanced') === 'true';
	return { step: isNaN(parseInt(step)) ? 0 : parseInt(step), selectField, advanced };
};
