import { and, eq } from 'drizzle-orm';
import { db } from '../../db';
import type { LayoutServerLoad } from './$types';
import { comment } from '../../db/schema';

const PROJECT_ID = 'rknbb7gt8syva91n8rejknqz';

export const load: LayoutServerLoad = async ({ url }) => {
	const comments = await db.query.comment.findMany({
		where: and(eq(comment.projectId, PROJECT_ID), eq(comment.url, url.pathname + url.search))
	});

	return { comments, projectId: PROJECT_ID };
};
