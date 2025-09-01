import { baseSongs, clubs, statistics, usersToClubs } from './schema/tables';
import { oauthAccounts, sessions, users } from './schema/auth';

export type SelectClub = typeof clubs.$inferSelect;
export type InsertClub = typeof clubs.$inferInsert;

export type SelectBaseSong = typeof baseSongs.$inferSelect;
export type InsertBaseSong = typeof baseSongs.$inferInsert;

export type SelectStatistics = typeof statistics.$inferSelect;
export type InsertStatistics = typeof statistics.$inferInsert;

export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type SelectOAuthAccount = typeof oauthAccounts.$inferSelect;
export type InsertOAuthAccount = typeof oauthAccounts.$inferInsert;

export type SelectSession = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

export type SelectUserClubsRelation = typeof usersToClubs.$inferSelect;
export type InsertUserClubRelation = typeof usersToClubs.$inferInsert;
