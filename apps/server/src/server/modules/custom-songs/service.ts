// Service handle business logic, decoupled from Elysia controller
import { status } from 'elysia';

import type { CustomSongModel } from './model';

// If the class doesn't need to store a property,
// you may use `abstract class` to avoid class allocation
export abstract class CustomSong {
	static async createSong({
		song,
		startTime,
		userId,
		clubId,
	}: CustomSongModel.CreateSongBody) {
		// TODO: download, upload, respond with song/link

		if (Math.random() < 0.5) {
			throw status(
				400,
				'Invalid song or start time' satisfies CustomSongModel.CreateSongInvalid
			);
		}

		return {
			song,
		};
	}
}
