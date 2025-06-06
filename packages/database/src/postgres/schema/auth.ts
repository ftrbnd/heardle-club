import { relations } from 'drizzle-orm';
import { pgTable, integer, timestamp, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from '../schema.helpers';
import { usersToClubs } from './tables';

export const users = pgTable('users', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	// TODO: add more fields like email, username, etc.
	...timestamps,
});
export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	oauthAccounts: many(oauthAccounts),
	usersToClubs: many(usersToClubs),
}));

export const oauthAccounts = pgTable('oauth_accounts', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	provider: varchar({ length: 10 }).notNull(),
	providerUserId: varchar({ length: 100 }).notNull(),
	userId: integer().notNull(),
});
export const oauthAccountsRelations = relations(oauthAccounts, ({ one }) => ({
	user: one(users, {
		fields: [oauthAccounts.userId],
		references: [users.id],
	}),
}));

export const sessions = pgTable('sessions', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: integer().notNull(),
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
