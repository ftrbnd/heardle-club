import { baseSongs, clubs, statistics, usersToClubs } from './tables';
import { oauthAccounts, sessions, users } from './auth';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const selectClubSchema = createSelectSchema(clubs);
export const insertClubSchema = createInsertSchema(clubs);
export type SelectClub = typeof clubs.$inferSelect;
export type InsertClub = typeof clubs.$inferInsert;

export const selectBaseSongSchema = createSelectSchema(baseSongs);
export const insertBaseSongSchema = createInsertSchema(baseSongs);
export type SelectBaseSong = typeof baseSongs.$inferSelect;
export type InsertBaseSong = typeof baseSongs.$inferInsert;

export const selectStatisticSchema = createSelectSchema(statistics);
export const insertStatisticSchema = createInsertSchema(statistics);
export type SelectStatistics = typeof statistics.$inferSelect;
export type InsertStatistics = typeof statistics.$inferInsert;

export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);
export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const selectOAuthAccountSchema = createSelectSchema(oauthAccounts);
export const insertOAuthAccountSchema = createInsertSchema(oauthAccounts);
export type SelectOAuthAccount = typeof oauthAccounts.$inferSelect;
export type InsertOAuthAccount = typeof oauthAccounts.$inferInsert;

export const selectSessionSchema = createSelectSchema(sessions);
export const insertSessionSchema = createInsertSchema(sessions);
export type SelectSession = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

export const selectUsersToClubsSchema = createSelectSchema(usersToClubs);
export const insertUsersToClubsSchema = createInsertSchema(usersToClubs);
export type SelectUserClubsRelation = typeof usersToClubs.$inferSelect;
export type InsertUserClubRelation = typeof usersToClubs.$inferInsert;
