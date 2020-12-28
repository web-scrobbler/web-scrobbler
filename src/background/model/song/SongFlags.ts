export interface SongFlags {
	/**
	 * Flag means song is scrobbled successfully.
	 */
	isScrobbled: boolean;

	/**
	 * Flag indicated song info is changed or approved by user.
	 */
	isCorrectedByUser: boolean;

	/**
	 * Flag indicated song is known by scrobbling service.
	 */
	isValid: boolean;

	/**
	 * Flag indicates song is marked as playing by controller.
	 */
	isMarkedAsPlaying: boolean;

	/**
	 * Flag means song is ignored by controller.
	 */
	isSkipped: boolean;

	/**
	 * Flag means song is replaying again.
	 */
	isReplaying: boolean;
}

export function createDefaultSongFlags(): SongFlags {
	return {
		isCorrectedByUser: false,
		isMarkedAsPlaying: false,
		isReplaying: false,
		isScrobbled: false,
		isSkipped: false,
		isValid: false,
	};
}
