import 'dotenv/config';
import { reset, seed } from 'drizzle-seed';
import { db, schema } from '..';
import { clubs } from '../schema/tables';

async function main() {
	await reset(db, schema);

	await seed(db, { clubs }, { count: 10 }).refine((funcs) => ({
		clubs: {
			columns: {
				displayName: funcs.valuesFromArray({
					values: [
						'The Marías',
						'Clairo',
						'wave to earth',
						'Bad Bunny',
						'Mac DeMarco',
						'Men I Trust',
						'EDEN',
						'Lorde',
						'Lucy Dacus',
						'Wallows',
					],
					isUnique: false,
				}),
				subdomain: funcs.string({
					isUnique: true,
				}),
				heardleDay: funcs.int({
					minValue: 0,
					isUnique: false,
				}),
			},
		},
	}));
}

main();
