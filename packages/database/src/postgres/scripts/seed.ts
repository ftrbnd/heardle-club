import 'dotenv/config';
import { reset, seed } from 'drizzle-seed';
import { db, schema } from '..';
import { clubs, usersToClubs } from '../schema/tables';
import { users } from '../schema/auth';

async function main() {
	await reset(db, schema);

	await seed(db, { clubs, usersToClubs, users }, { count: 10 }).refine(
		(funcs) => ({
			clubs: {
				count: 7,
				columns: {
					id: funcs.valuesFromArray({
						values: [
							'2sSGPbdZJkaSE2AbcGOACx',
							'3l0CmX0FuQjFxr8SK7Vqag',
							'5069JTmv5ZDyPeZaCCXiCg',
							'4q3ewBCX7sLwd24euuV69X',
							'3Sz7ZnJQBIHsXLUSo0OQtM',
							'3zmfs9cQwzJl575W1ZYXeT',
							'1t20wYnTiAT0Bs7H1hv9Wt',
							'163tK9Wjr9P9DmM0AVK7lm',
							'07D1Bjaof0NFlU32KXiqUP',
							'0NIPkIjTV8mB795yEIiPYL',
						],
						isUnique: true,
					}),
					displayName: funcs.fullName({
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
		})
	);
}

main();
