import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod/v4';
import { baseSongs, clubs, statistics } from './schema/tables.js';
import { oauthAccounts, sessions, users } from './schema/auth.js';

export const clubSelectSchema = createSelectSchema(clubs);
export type SelectClub = z.infer<typeof clubSelectSchema>;

export const clubInsertSchema = createInsertSchema(clubs);
export type InsertClub = z.infer<typeof clubInsertSchema>;

export const baseSongSelectSchema = createSelectSchema(baseSongs);
export type SelectBaseSong = z.infer<typeof baseSongSelectSchema>;

export const baseSongInsertSchema = createInsertSchema(baseSongs);
export type InsertBaseSong = z.infer<typeof baseSongInsertSchema>;

export const statisticsSelectSchema = createSelectSchema(statistics);
export type SelectStatistics = z.infer<typeof statisticsSelectSchema>;

export const statisticsInsertSchema = createInsertSchema(statistics);
export type InsertStatistics = z.infer<typeof statisticsInsertSchema>;

export const userSelectSchema = createSelectSchema(users);
export type SelectUser = z.infer<typeof userSelectSchema>;

export const userInsertSchema = createInsertSchema(users);
export type InsertUser = z.infer<typeof userInsertSchema>;

export const oauthAccountSelectSchema = createSelectSchema(oauthAccounts);
export type SelectOAuthAccount = z.infer<typeof oauthAccountSelectSchema>;

export const oauthAccountInsertSchema = createInsertSchema(oauthAccounts);
export type InsertOAuthAccount = z.infer<typeof oauthAccountInsertSchema>;

export const sessionSelectSchema = createSelectSchema(sessions);
export type SelectSession = z.infer<typeof sessionSelectSchema>;

export const sessionInsertSchema = createInsertSchema(sessions);
export type InsertSession = z.infer<typeof sessionInsertSchema>;
