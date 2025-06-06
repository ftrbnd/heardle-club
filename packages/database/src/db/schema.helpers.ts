import { sql } from 'drizzle-orm';
import { timestamp } from 'drizzle-orm/pg-core';

export const timestamps = {
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp().$onUpdate(() => sql`(now() AT TIME ZONE 'utc'::text)`),
};
