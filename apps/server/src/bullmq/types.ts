import { ClubModel } from '@/elysia/modules/clubs/model';

export type DownloadJobDataType = ClubModel.DownloadClubSongsBody;

export const defaultDownloadJobProgress = {
	currentTrack: null,
	currentStep: 0,
	totalTracks: 0,
	percentage: 0,
} as const;

export const defaultDailyJobProgress = {
	message: '',
	percentage: 0,
};
