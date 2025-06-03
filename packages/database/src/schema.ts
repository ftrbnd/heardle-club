import { relations } from 'drizzle-orm';
import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 255 }).notNull(),
	age: integer().notNull(),
	email: varchar({ length: 255 }).notNull().unique(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
	statistics: many(statisticsTable),
}));

export const clubsTable = pgTable('clubs', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 255 }).notNull().unique(),
});

export const statisticsTable = pgTable('statistics', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: integer(),
	clubId: integer(),
});

export const statisticsRelations = relations(statisticsTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [statisticsTable.userId],
		references: [usersTable.id],
	}),
	club: one(clubsTable, {
		fields: [statisticsTable.clubId],
		references: [clubsTable.id],
	}),
}));
