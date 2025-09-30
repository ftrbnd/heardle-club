import 'dotenv/config';

import { reset, seed } from 'drizzle-seed';
import { db, schema } from '..';
import { clubs, usersToClubs } from '../schema/tables';
import { redis } from '../../redis';
import { users } from '../schema/auth';
import {
	AVATARS_BUCKET,
	defaultClub,
	defaultClubs,
	defaultUser,
	SONGS_BUCKET,
} from './data';
import { emptyBucket } from './util';
import { eq, not } from 'drizzle-orm';
import { SelectUserClubsRelation } from '../schema/types';

async function main() {
	await reset(db, schema);
	console.log('✔️  Reset POSTGRES database');

	// seed 20 random users
	await seed(db, { users }, { count: 50 }).refine((f) => ({
		users: {
			columns: {
				id: f.string({
					isUnique: true,
				}),
				email: f.email(),
				displayName: f.fullName(),
				imageURL: f.default({
					defaultValue: null,
				}),
			},
		},
	}));

	const seededUsers = await db.select().from(users);
	const userClubRelations: SelectUserClubsRelation[] = []; // owner and club relation

	// assign the 10 default clubs an owner
	for (let i = 0; i < defaultClubs.length; i++) {
		const club = defaultClubs[i];

		const [newClub] = await db
			.insert(clubs)
			.values({
				...club,
				ownerId: seededUsers[i].id,
			})
			.returning();

		userClubRelations.push({ clubId: newClub.id, userId: newClub.ownerId });
	}

	// seed my default user and club to own
	const [insertedDefaultUser] = await db
		.insert(users)
		.values(defaultUser)
		.returning();
	const [insertedDefaultClub] = await db
		.insert(clubs)
		.values(defaultClub)
		.returning();
	const defaultRelation = {
		clubId: insertedDefaultClub.id,
		userId: insertedDefaultUser.id,
	};

	// seed owner and club relations
	await db
		.insert(usersToClubs)
		.values([...userClubRelations, defaultRelation])
		.returning();

	const allClubs = await db.select().from(clubs);
	for (const club of allClubs) {
		const usersToAdd = await db
			.select()
			.from(users)
			.where(not(eq(users.id, club.ownerId)))
			.limit(5);
		const newRelations = usersToAdd.map((user) => ({
			userId: user.id,
			clubId: club.id,
		}));

		await db.insert(usersToClubs).values(newRelations);
	}

	console.log(`✔️  Seeded POSTGRES database`);

	const p = redis.multi();

	for (const club of [...defaultClubs, insertedDefaultClub]) {
		p.set(`subdomain:${club.subdomain}`, {
			artistId: club.artistId,
			displayName: club.displayName,
		});
	}

	await p.exec();
	console.log('✔️  Seeded REDIS database with clubs');

	const bullMqEntries = await redis.keys('bull:*');
	let count = await redis.del(...bullMqEntries);
	console.log(`✔️  Deleted ${count} BULLMQ entries`);

	const guessEntries = await redis.keys('guesses:*');
	if (guessEntries.length > 0) {
		count = await redis.del(...guessEntries);
		console.log(`✔️  Deleted ${count} guess entries`);
	}

	await emptyBucket(SONGS_BUCKET);
	await emptyBucket(AVATARS_BUCKET);
	console.log('✔️  Reset Supabase storage');
}

main();
