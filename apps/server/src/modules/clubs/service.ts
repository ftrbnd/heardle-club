// Service handle business logic, decoupled from Elysia controller
import { status } from 'elysia';

import type { ClubModel } from './model';
import { insertClub } from '@repo/database/api';
import { generateSecureRandomString } from '@/utils/random';

// If the class doesn't need to store a property,
// you may use `abstract class` to avoid class allocation
export abstract class Club {
	static async createClub({
		displayName,
		subdomain,
	}: ClubModel.createClubBody) {
		// TODO: create club
		const newClub = await insertClub({
			id: generateSecureRandomString(),
			displayName,
			subdomain,
		});

		return {
			clubId: newClub.id,
		};
	}
}
