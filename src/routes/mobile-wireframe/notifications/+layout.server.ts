import type { NotificationType } from '../../../utils/types';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ url }) => {
	const acknowledge = url.searchParams.get('acknowledge');
	const filter = url.searchParams.get('filter') as NotificationType;
	return { acknowledge: acknowledge === 'true', filter };
};
