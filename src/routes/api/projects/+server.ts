import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '../../../db';
import { project } from '../../../db/schema';

export const POST: RequestHandler = async ({ request }) => {
	const { name } = await request.json();

	if (typeof name !== 'string') {
		return error(400, 'Missing or wrong name type');
	}

	const [res] = await db
		.insert(project)
		.values({
			name
		})
		.returning();

	return json(res);
};

export const GET: RequestHandler = async () => {
	const res = await db.query.project.findMany();
	return json(res);
};
