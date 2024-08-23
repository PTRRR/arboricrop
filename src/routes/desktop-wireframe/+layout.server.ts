import type { LayoutServerLoad } from './$types';
import { config } from 'dotenv';

config();

export const load: LayoutServerLoad = async () => {
	return { projectId: process.env.DESKTOP_WIREFRAME_PROJECT_ID || '' };
};
