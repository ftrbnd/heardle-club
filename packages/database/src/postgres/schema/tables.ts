import {
	index,
	integer,
	pgTable,
	primaryKey,
	text,
	varchar,
} from 'drizzle-orm/pg-core';
import { timestamps } from '../schema.helpers';
import { relations, sql } from 'drizzle-orm';
import { users } from './auth';

export const clubs = pgTable(
	'clubs',
	{
		id: text().primaryKey(),
		artistId: text().notNull(),
		subdomain: varchar({ length: 25 }).unique().notNull(),
		displayName: varchar({ length: 50 }).notNull(),
		heardleDay: integer().notNull().default(0),
		imageURL: text(),
		ownerId: text()
			.references(() => users.id)
			.notNull(),
		...timestamps,
	},
	(table) => [
		index('search_index').using(
			'gin',
			sql`(
				setweight(to_tsvector('english', ${table.displayName}), 'A') ||
				setweight(to_tsvector('english', ${table.subdomain}), 'B')
			)`
		),
	]
);

export const clubsRelations = relations(clubs, ({ many, one }) => ({
	songs: many(baseSongs),
	statistics: many(statistics),
	usersToClubs: many(usersToClubs),
	owner: one(users, {
		fields: [clubs.ownerId],
		references: [users.id],
	}),
}));

export const usersToClubs = pgTable(
	'users_to_clubs',
	{
		userId: text()
			.notNull()
			.references(() => users.id),
		clubId: text()
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
	id: text().primaryKey(),
	trackId: text().notNull(),
	title: text().notNull(),
	artist: varchar({ length: 50 }).array().notNull(),
	album: varchar({ length: 100 }),
	image: text(),
	audio: text().notNull(),
	clubId: text().notNull(),
	...timestamps,
});

export const baseSongsRelations = relations(baseSongs, ({ one }) => ({
	club: one(clubs, {
		fields: [baseSongs.clubId],
		references: [clubs.id],
	}),
}));

export const statistics = pgTable('statistics', {
	id: text().primaryKey(),
	gamesPlayed: integer().notNull().default(0),
	gamesWon: integer().notNull().default(0),
	currentStreak: integer().notNull().default(0),
	maxStreak: integer().notNull().default(0),
	accuracy: integer().notNull().default(0),
	clubId: text().notNull(),
	...timestamps,
});

export const statisticsRelations = relations(statistics, ({ one }) => ({
	club: one(clubs, {
		fields: [statistics.clubId],
		references: [clubs.id],
	}),
}));
