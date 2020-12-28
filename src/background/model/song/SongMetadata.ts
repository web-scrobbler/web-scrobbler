export interface SongMetadata {
	/**
	 * Time when song is started playing in UNIX timestamp format.
	 */
	startTimestamp: number;

	albumMbId?: string;
	albumUrl?: string;
	artistUrl?: string;
	notificationId?: string;
	trackArtUrl?: string;
	trackUrl?: string;
	userPlayCount?: number;
}

export function createDefaultSongMetadata(): SongMetadata {
	return {
		startTimestamp: Math.floor(Date.now() / 1000),
	};
}
