import type { LayoutServerLoad } from './$types';
import { config } from 'dotenv';

config();

export const load: LayoutServerLoad = async () => {
  return { baseUrl: "/mobile-mvp" };
};
