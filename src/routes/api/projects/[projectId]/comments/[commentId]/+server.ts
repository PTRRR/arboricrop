import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '../../../../../../db';
import { comment } from '../../../../../../db/schema';
import { and, eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params }) => {
	const res = await db.query.comment.findFirst({
		where: and(eq(comment.projectId, params.projectId), eq(comment.id, params.commentId))
	});
	return json(res);
};

export const PUT: RequestHandler = async ({ params, request }) => {
	const { name, x, y, text, url } = await request.json();

	const [res] = await db
		.update(comment)
		.set({ name, x, y, text, url })
		.where(eq(comment.id, params.commentId))
		.returning();

	return json(res);
};

export const DELETE: RequestHandler = async ({ params }) => {
	const [res] = await db
		.delete(comment)
		.where(and(eq(comment.projectId, params.projectId), eq(comment.id, params.commentId)))
		.returning();
	return json(res);
};
