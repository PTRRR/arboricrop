import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '../../../../db';
import { project } from '../../../../db/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params }) => {
	const res = await db.query.project.findFirst({
		where: eq(project.id, params.projectId)
	});
	return json(res);
};

export const PUT: RequestHandler = async ({ params, request }) => {
	const { name } = await request.json();

	if (typeof name !== 'string') {
		return error(400, 'Missing or wrong name type');
	}

	const [res] = await db
		.update(project)
		.set({ name })
		.where(eq(project.id, params.projectId))
		.returning();

	return json(res);
};

export const DELETE: RequestHandler = async ({ params }) => {
	const [res] = await db.delete(project).where(eq(project.id, params.projectId)).returning();
	return json(res);
};
