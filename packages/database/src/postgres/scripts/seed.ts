import 'dotenv/config';
import { reset } from 'drizzle-seed';
import { db, InsertClub, schema } from '..';
import { clubs } from '../schema/tables';
import { redis } from '../../redis';

const defaultClubs: InsertClub[] = [
	{
		artistId: '2sSGPbdZJkaSE2AbcGOACx',
		displayName: 'The Marías',
		subdomain: 'themarias',
		id: '001',
	},
	{
		artistId: '3l0CmX0FuQjFxr8SK7Vqag',
		displayName: 'Clairo',
		subdomain: 'clairo',
		id: '002',
	},
	{
		artistId: '3l0CmX0FuQjFxr8SK7Vqag',
		displayName: 'wave to earth',
		subdomain: 'wavetoearth',
		id: '003',
	},
	{
		artistId: '4q3ewBCX7sLwd24euuV69X',
		displayName: 'Bad Bunny',
		subdomain: 'badbunny',
		id: '004',
	},
	{
		artistId: '3Sz7ZnJQBIHsXLUSo0OQtM',
		displayName: 'Mac DeMarco',
		subdomain: 'macdemarco',
		id: '005',
	},
	{
		artistId: '3zmfs9cQwzJl575W1ZYXeT',
		displayName: 'Men I Trust',
		subdomain: 'menitrust',
		id: '006',
	},
	{
		artistId: '1t20wYnTiAT0Bs7H1hv9Wt',
		displayName: 'EDEN',
		subdomain: 'eden',
		id: '007',
	},
	{
		artistId: '163tK9Wjr9P9DmM0AVK7lm',
		displayName: 'Lorde',
		subdomain: 'lorde',
		id: '008',
	},
	{
		artistId: '07D1Bjaof0NFlU32KXiqUP',
		displayName: 'Lucy Dacus',
		subdomain: 'lucydacus',
		id: '009',
	},
	{
		artistId: '0NIPkIjTV8mB795yEIiPYL',
		displayName: 'Wallows',
		subdomain: 'wallows',
		id: '010',
	},
];

async function main() {
	await reset(db, schema);
	console.log('✔️  Reset database');

	const insertedClubs = await db.insert(clubs).values(defaultClubs).returning();
	console.log(
		`✔️  Seeded POSTGRES database with ${insertedClubs.length} clubs`
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
