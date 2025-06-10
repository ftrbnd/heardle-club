import { relations } from 'drizzle-orm';
import { pgTable, timestamp, varchar, text } from 'drizzle-orm/pg-core';
import { timestamps } from '../schema.helpers';
import { usersToClubs } from './tables';

export const users = pgTable('users', {
	id: text().primaryKey(),
	email: text().unique().notNull(),
	displayName: varchar({ length: 100 }).notNull(),
	...timestamps,
});
export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	oauthAccounts: many(oauthAccounts),
	usersToClubs: many(usersToClubs),
}));

export const oauthAccounts = pgTable('oauth_accounts', {
	id: text().primaryKey(),
	provider: varchar({ length: 10 }).notNull(),
	providerUserId: varchar({ length: 100 }).notNull(),
	userId: text().notNull(),
});
export const oauthAccountsRelations = relations(oauthAccounts, ({ one }) => ({
	user: one(users, {
		fields: [oauthAccounts.userId],
		references: [users.id],
	}),
}));

export const sessions = pgTable('sessions', {
	id: text().primaryKey(),
	userId: text().notNull(),
	expiresAt: timestamp({
		withTimezone: true,
		mode: 'date',
	}).notNull(),
	...timestamps,
});
export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));
