import {
	integer,
	pgTable,
	primaryKey,
	text,
	varchar,
} from 'drizzle-orm/pg-core';
import { timestamps } from '../schema.helpers.js';
import { relations } from 'drizzle-orm';
import { users } from './auth.js';

export const clubs = pgTable('clubs', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	subdomain: varchar({ length: 10 }).unique().notNull(),
	displayName: varchar({ length: 50 }).notNull(),
	heardleDay: integer().notNull().default(0),
	...timestamps,
});

export const clubsRelations = relations(clubs, ({ many }) => ({
	songs: many(baseSongs),
	statistics: many(statistics),
	usersToClubs: many(usersToClubs),
}));

export const usersToClubs = pgTable(
	'users_to_clubs',
	{
		userId: integer()
			.notNull()
			.references(() => users.id),
		clubId: integer()
			.notNull()
			.references(() => clubs.id),
	},
	(t) => [primaryKey({ columns: [t.userId, t.clubId] })]
);
export const usersToClubsRelations = relations(usersToClubs, ({ one }) => ({
	club: one(clubs, {
		fields: [usersToClubs.clubId],
		references: [clubs.id],
	}),
	user: one(users, {
		fields: [usersToClubs.userId],
		references: [users.id],
	}),
}));

export const baseSongs = pgTable('base_songs', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	title: text().notNull(),
	artist: varchar({ length: 50 }).notNull(),
	album: varchar({ length: 100 }),
	image: text(),
	audio: text().notNull(),
	clubId: integer().notNull(),
	...timestamps,
});

export const baseSongsRelations = relations(baseSongs, ({ one }) => ({
	club: one(clubs, {
		fields: [baseSongs.clubId],
		references: [clubs.id],
	}),
}));

export const statistics = pgTable('statistics', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	gamesPlayed: integer().notNull().default(0),
	gamesWon: integer().notNull().default(0),
	currentStreak: integer().notNull().default(0),
	maxStreak: integer().notNull().default(0),
	accuracy: integer().notNull().default(0),
	clubId: integer().notNull(),
	...timestamps,
});

export const statisticsRelations = relations(statistics, ({ one }) => ({
	club: one(clubs, {
		fields: [statistics.clubId],
		references: [clubs.id],
	}),
}));
