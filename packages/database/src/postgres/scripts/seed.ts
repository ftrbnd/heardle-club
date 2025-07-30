import 'dotenv/config';
import { reset } from 'drizzle-seed';
import { db, InsertClub, InsertUser, schema } from '..';
import { clubs, usersToClubs } from '../schema/tables';
import { redis } from '../../redis';
import { users } from '../schema/auth';

const defaultUsers: InsertUser[] = [
	{
		id: '001',
		email: 'giosalas25@gmail.com',
		displayName: 'giosalad',
	},
	{
		id: '002',
		email: 'fakeuser@test.com',
		displayName: 'Fake User',
	},
];

const defaultClubs: InsertClub[] = [
	{
		artistId: '2sSGPbdZJkaSE2AbcGOACx',
		displayName: 'The Marías',
		subdomain: 'themarias',
		id: '001',
		ownerId: defaultUsers[0].id,
	},
	{
		artistId: '3l0CmX0FuQjFxr8SK7Vqag',
		displayName: 'Clairo',
		subdomain: 'clairo',
		id: '002',
		ownerId: defaultUsers[0].id,
	},
	{
		artistId: '5069JTmv5ZDyPeZaCCXiCg',
		displayName: 'wave to earth',
		subdomain: 'wavetoearth',
		id: '003',
		ownerId: defaultUsers[0].id,
	},
	{
		artistId: '4q3ewBCX7sLwd24euuV69X',
		displayName: 'Bad Bunny',
		subdomain: 'badbunny',
		id: '004',
		ownerId: defaultUsers[0].id,
	},
	{
		artistId: '3Sz7ZnJQBIHsXLUSo0OQtM',
		displayName: 'Mac DeMarco',
		subdomain: 'macdemarco',
		id: '005',
		ownerId: defaultUsers[0].id,
	},
	{
		artistId: '3zmfs9cQwzJl575W1ZYXeT',
		displayName: 'Men I Trust',
		subdomain: 'menitrust',
		id: '006',
		ownerId: defaultUsers[0].id,
	},
	{
		artistId: '1t20wYnTiAT0Bs7H1hv9Wt',
		displayName: 'EDEN',
		subdomain: 'eden',
		id: '007',
		ownerId: defaultUsers[0].id,
	},
	{
		artistId: '163tK9Wjr9P9DmM0AVK7lm',
		displayName: 'Lorde',
		subdomain: 'lorde',
		id: '008',
		ownerId: defaultUsers[0].id,
	},
	{
		artistId: '07D1Bjaof0NFlU32KXiqUP',
		displayName: 'Lucy Dacus',
		subdomain: 'lucydacus',
		id: '009',
		ownerId: defaultUsers[0].id,
	},
	{
		artistId: '0NIPkIjTV8mB795yEIiPYL',
		displayName: 'Wallows',
		subdomain: 'wallows',
		id: '010',
		ownerId: defaultUsers[0].id,
	},
	{
		artistId: '1oPRcJUkloHaRLYx0olBLJ',
		displayName: 'Magdalena Bay',
		subdomain: 'magdalenabay',
		id: '011',
		ownerId: defaultUsers[1].id,
	},
];

async function main() {
	await reset(db, schema);
	console.log('✔️  Reset database');

	const insertedUsers = await db.insert(users).values(defaultUsers).returning();
	const insertedClubs = await db.insert(clubs).values(defaultClubs).returning();

	const relations = insertedClubs.map((club) => {
		if (club.id === '011')
			return {
				clubId: club.id,
				userId: defaultUsers[1].id,
			};

		return {
			clubId: club.id,
			userId: defaultUsers[0].id,
		};
	});
	const result = await db.insert(usersToClubs).values(relations).returning();

	console.log(
		`✔️  Seeded POSTGRES database with ${insertedUsers.length} user${insertedUsers.length === 1 ? '' : 's'}, ${insertedClubs.length} club${insertedClubs.length === 1 ? '' : 's'}, and ${result.length} users-to-clubs relations`
	);

	const p = redis.multi();

	for (const club of insertedClubs) {
		p.set(`subdomain:${club.subdomain}`, {
			artistId: club.artistId,
			displayName: club.displayName,
		});
	}

	await p.exec();
	console.log('✔️  Seeded REDIS database');
}

main();
