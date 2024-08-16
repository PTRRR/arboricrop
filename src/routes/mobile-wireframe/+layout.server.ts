import type { LayoutServerLoad } from './$types';

const PROJECT_ID = 'rknbb7gt8syva91n8rejknqz';

export const load: LayoutServerLoad = async ({ url }) => {
	return { projectId: PROJECT_ID };
};
