// Service handle business logic, decoupled from Elysia controller
import { status } from 'elysia';

import type { ClubModel } from './model';
import { insertClub } from '@repo/database/api';
import { generateSecureRandomString } from '@/utils/random';
import { spotify } from '@/utils/spotify';

// If the class doesn't need to store a property,
// you may use `abstract class` to avoid class allocation
export abstract class Club {
	static async createClub({
		displayName,
		subdomain,
	}: ClubModel.CreateClubBody): Promise<ClubModel.CreateClubResponse> {
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

	// Clairo artist id: 3l0CmX0FuQjFxr8SK7Vqag
	static async downloadClubSongs({
		artistId,
		clubId,
	}: ClubModel.DownloadClubSongsBody): Promise<ClubModel.DownloadClubSongsResponse> {
		// TODO: let user add 'appears_on' option to includeGroups param
		const albums = await spotify.artists.albums(
			artistId,
			'album,single',
			undefined,
			50
		);

		const allTracks: string[] = [];

		for (const album of albums.items) {
			const tracks = await spotify.albums.tracks(album.id, undefined, 50);

			for (const track of tracks.items) {
				if (!allTracks.includes(track.name)) allTracks.push(track.name);
			}
		}

		return {
			count: allTracks.length,
			tracks: allTracks,
		};
	}
}
