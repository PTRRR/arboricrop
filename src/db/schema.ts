import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, doublePrecision } from 'drizzle-orm/pg-core';

export const project = pgTable('project', {
	id: text('id')
		.$defaultFn(() => createId())
		.primaryKey(),
	name: text('name').notNull()
});

export const projectRelations = relations(project, ({ many }) => ({
	comments: many(comment)
}));

export const comment = pgTable('comment', {
	id: text('id')
		.$defaultFn(() => createId())
		.primaryKey(),
	url: text('url').notNull(),
	name: text('name').notNull(),
	text: text('text').notNull(),
	x: doublePrecision('x').notNull(),
	y: doublePrecision('y').notNull(),
	created: timestamp('created').defaultNow(),
	projectId: text('projectId').references(() => project.id)
});
