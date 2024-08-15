import { eq } from 'drizzle-orm';
import { db } from '../../db';
import type { LayoutServerLoad } from './$types';
import { comment } from '../../db/schema';

export const load: LayoutServerLoad = async ({ url }) => {
	const comments = await db.query.comment.findMany({
		where: eq(comment.url, url.href)
	});

	return { comments };
};
