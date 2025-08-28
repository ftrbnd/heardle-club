export const durationFormatted = (duration_ms: number) => {
	const seconds = Math.floor(duration_ms / 1000);
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
