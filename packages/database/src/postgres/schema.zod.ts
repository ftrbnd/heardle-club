import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { baseSongs, clubs, statistics } from './schema/tables';
import { oauthAccounts, sessions, users } from './schema/auth';

export const selectClubSchema = createSelectSchema(clubs);
export const insertClubSchema = createInsertSchema(clubs);

export const selectBaseSongSchema = createSelectSchema(baseSongs);
export const insertBaseSongSchema = createInsertSchema(baseSongs);

export const selectStatisticSchema = createSelectSchema(statistics);
export const insertStatisticSchema = createInsertSchema(statistics);

export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);

export const selectOAuthAccountSchema = createSelectSchema(oauthAccounts);
export const insertOAuthAccountSchema = createInsertSchema(oauthAccounts);

export const selectSessionSchema = createSelectSchema(sessions);
export const insertSessionSchema = createInsertSchema(sessions);
