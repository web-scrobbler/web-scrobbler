import type { DisallowedReason } from './object/disallowed-reason';

export interface TimeInfo {
	/**
	 * Currentime in seconds
	 */
	currentTime?: number;

	/**
	 * Duration in seconds
	 */
	duration?: number;
}

export interface ArtistTrackInfo {
	/**
	 * Artist name
	 */
	artist?: string | null;

	/**
	 * Track name
	 */
	track?: string | null;
}

export interface TrackInfoWithAlbum extends ArtistTrackInfo {
	/**
	 * Album name
	 */
	album?: string | null;
}

export interface BaseState extends TrackInfoWithAlbum {
	/**
	 * URL to track art image.
	 */
	trackArt?: string | null;
}

export interface State extends BaseState {
	/**
	 * Album artist.
	 */
	albumArtist?: string | null;

	/**
	 * Track unique ID.
	 */
	uniqueID?: string | null;

	/**
	 * Track duration.
	 */
	duration?: number | null;

	/**
	 * Current time.
	 */
	currentTime?: number | null;

	/**
	 * Playing/pause state.
	 */
	isPlaying?: boolean | null;

	/**
	 * Whether the current track is a podcast episode.
	 */
	isPodcast?: boolean | null;

	/**
	 * Origin URL.
	 */
	originUrl?: string | null;

	/**
	 * Is scrobbling allowed
	 */
	scrobblingDisallowedReason?: DisallowedReason | null;
}
