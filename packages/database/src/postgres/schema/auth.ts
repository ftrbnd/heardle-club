import { relations } from 'drizzle-orm';
import {
	pgTable,
	timestamp,
	varchar,
	text,
	customType,
} from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps';
import { clubs, usersToClubs } from './tables';

export const users = pgTable('users', {
	id: text().primaryKey(),
	email: text().unique().notNull(),
	displayName: varchar({ length: 100 }),
	imageURL: text(),
	...timestamps,
});
export const usersRelations = relations(users, ({ many, one }) => ({
	sessions: many(sessions),
	oauthAccounts: many(oauthAccounts),
	usersToClubs: many(usersToClubs),
	club: one(clubs),
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

const binary = customType<{
	data: Uint8Array;
	default: false;
}>({
	dataType() {
		return 'bytea';
	},
});

export const sessions = pgTable('sessions', {
	id: text().primaryKey(),
	secretHash: binary().notNull(),
	userId: text().notNull(),
	lastVerifiedAt: timestamp().notNull(),
	...timestamps,
});
export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));
