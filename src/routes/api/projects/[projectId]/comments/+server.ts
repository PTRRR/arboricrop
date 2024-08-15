import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '../../../../../db';
import { comment } from '../../../../../db/schema';

export const POST: RequestHandler = async ({ request, params }) => {
	const { name, x, y, text, url } = await request.json();

	if (typeof name !== 'string') {
		return error(400, 'Missing or wrong name type');
	}

	if (typeof text !== 'string') {
		return error(400, 'Missing or wrong text type');
	}

	if (typeof url !== 'string') {
		return error(400, 'Missing or wrong url type');
	}

	if (typeof x !== 'number') {
		return error(400, 'Missing or wrong x type');
	}

	if (typeof y !== 'number') {
		return error(400, 'Missing or wrong y type');
	}

	const [res] = await db
		.insert(comment)
		.values({
			name,
			text,
			x,
			y,
			projectId: params.projectId,
			url
		})
		.returning();

	return json(res);
};

export const GET: RequestHandler = async () => {
	const res = await db.query.comment.findMany();
	return json(res);
};
