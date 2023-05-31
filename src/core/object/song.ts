import type { ConnectorMeta } from '@/core/connectors';
import { State } from '@/core/types';

export interface ProcessedSongData {
	artist?: string | null;
	album?: string | null;
	albumArtist?: string | null;
	track?: string | null;
	duration?: number | null;
}

export interface ParsedSongData extends ProcessedSongData {
	trackArt?: string | null;
	uniqueID?: string | null;
	originUrl?: string | null;
	isPodcast?: boolean | null;
	isPlaying?: boolean | null;
	currentTime?: number | null;
}

export type Flags =
	| {
			isScrobbled: boolean;
			isCorrectedByUser: boolean;
			isRegexEditedByUser: {
				track: boolean;
				artist: boolean;
				album: boolean;
				albumArtist: boolean;
			};
			isAlbumFetched: boolean;
			isValid: boolean;
			isMarkedAsPlaying: boolean;
			isSkipped: boolean;
			isReplaying: boolean;
	  }
	| Record<string, never>;

export type Metadata =
	| {
			label: string;
			startTimestamp: number;

			albumMbId?: string;
			albumUrl?: string;
			artistUrl?: string;
			notificationId?: string;
			trackArtUrl?: string;
			trackUrl?: string;
			userPlayCount?: number;
			userloved?: boolean;
	  }
	| Record<string, never>;

export interface CloneableSong {
	parsed: ParsedSongData;
	processed: ProcessedSongData;
	noRegex: ProcessedSongData;
	flags: Flags;
	metadata: Metadata;
	connectorLabel: string;
}

export abstract class BaseSong {
	public abstract parsed: ParsedSongData;
	public abstract processed: ProcessedSongData;
	public abstract noRegex: ProcessedSongData;
	public abstract flags: Flags;
	public abstract metadata: Metadata;
	public abstract connectorLabel: string;

	/**
	 * Get song artist.
	 *
	 * @returns Song artist
	 */
	getArtist(): string | null | undefined {
		return this.processed.artist || this.parsed.artist;
	}

	/**
	 * Get song title.
	 *
	 * @returns Song title
	 */
	getTrack(): string | null | undefined {
		return this.processed.track || this.parsed.track;
	}

	/**
	 * Get song album.
	 *
	 * @returns Song album
	 */
	getAlbum(): string | null | undefined {
		return this.processed.album || this.parsed.album;
	}

	/**
	 * Return song's album artist (Optional)
	 * @returns Album artist
	 */
	getAlbumArtist(): string | null | undefined {
		return this.processed.albumArtist || this.parsed.albumArtist;
	}

	/**
	 * Returns song's processed or parsed duration in seconds.
	 * Parsed duration (received from connector) is preferred.
	 *
	 * @returns Song duration
	 */
	getDuration(): number | null | undefined {
		return this.parsed.duration || this.processed.duration;
	}

	/**
	 * Return the track art URL associated with the song.
	 * Parsed track art (received from connector) is preferred.
	 *
	 * @returns Track art URL
	 */
	getTrackArt(): string | null {
		return this.parsed.trackArt || this.metadata.trackArtUrl || null;
	}

	/**
	 * Get formatted "Artist - Track" string. Return null if song is empty.
	 *
	 * @returns Formatted string
	 */
	getArtistTrackString(): string | null {
		if (this.isEmpty()) {
			return null;
		}
		return `${this.getArtist() ?? 'undefined'} — ${
			this.getTrack() ?? 'undefined'
		}`;
	}

	/**
	 * Get song unique ID.
	 *
	 * @returns Unique ID
	 */
	getUniqueId(): string | undefined | null {
		return this.parsed.uniqueID;
	}

	/**
	 * Get song source URL.
	 *
	 * @returns source URL.
	 */
	getOriginUrl(): string | undefined | null {
		return this.parsed.originUrl;
	}

	/**
	 * Check if song is empty. Empty song means it's missing
	 * either artist or track title.
	 *
	 * @returns True if song is empty; false otherwise
	 */
	isEmpty(): boolean {
		return !(this.getArtist() && this.getTrack());
	}

	/**
	 * Check if song is valid. The song means valid if it's known by
	 * scrobbler service or is corrected by the user.
	 *
	 * @returns True if song is valid; false otherwise
	 */
	isValid(): boolean {
		return this.flags.isValid || this.flags.isCorrectedByUser;
	}

	/**
	 * Check if song equals another song.
	 * @param song - Song instance to compare
	 * @returns Check result
	 */
	equals(song: BaseSong): boolean {
		if (!song) {
			return false;
		}

		if (!(song instanceof BaseSong)) {
			return false;
		}

		const thisUniqueId = this.getUniqueId();
		const otherUniqueId = song.getUniqueId();
		if (thisUniqueId || otherUniqueId) {
			return thisUniqueId === otherUniqueId;
		}

		return (
			this.getArtist() === song.getArtist() &&
			this.getTrack() === song.getTrack() &&
			this.getAlbum() === song.getAlbum()
		);
	}

	/**
	 * Get a string representing the song.
	 *
	 * @returns String representing the object.
	 */
	toString(): string {
		return JSON.stringify(this, null, 2);
	}

	/**
	 * Get song data to send it to different context.
	 *
	 * @returns Object contain song data
	 */
	getCloneableData(): CloneableSong {
		return {
			parsed: this.parsed,
			noRegex: this.noRegex,
			processed: this.processed,
			metadata: this.metadata,
			flags: this.flags,
			connectorLabel: this.connectorLabel,
		};
	}

	/**
	 * Set `Love` status of song.
	 *
	 * This function is supposed to be used by multiple scrobblers
	 * (services). Each service can have different value of `Love` flag;
	 * the behavior of the function is to set `Love` to true, if all
	 * services have the song with `Love` set to true.
	 * @param isLoved - Flag means song is loved or not
	 * @param force - Force status assignment
	 */
	setLoveStatus(isLoved: boolean, force = false): void {
		if (force) {
			this.metadata.userloved = isLoved;
			return;
		}

		if (isLoved) {
			if (this.metadata.userloved === undefined) {
				this.metadata.userloved = true;
			}
		} else {
			this.metadata.userloved = false;
		}
	}

	/**
	 * Set default song info (artist, track, etc).
	 */
	abstract resetInfo(): void;

	/**
	 * Set default song data (flags and metadata only).
	 */
	abstract resetData(): void;

	/**
	 * Custom fields can be defined by user.
	 */
	static get USER_FIELDS(): string[] {
		return ['artist', 'track', 'album', 'albumArtist'];
	}

	/**
	 * Fields used to identify song.
	 */
	static get BASE_FIELDS(): ['artist', 'track', 'album', 'albumArtist'] {
		return ['artist', 'track', 'album', 'albumArtist'];
	}

	/**
	 * Fields in a processed song.
	 */
	static get PROCESSED_FIELDS(): [
		'track',
		'album',
		'artist',
		'albumArtist',
		'duration'
	] {
		return ['track', 'album', 'artist', 'albumArtist', 'duration'];
	}
}

/**
 * Song object.
 */
export default class Song extends BaseSong {
	public parsed: ParsedSongData;
	public processed: ProcessedSongData;
	public noRegex: ProcessedSongData;
	public flags: Flags;
	public metadata: Metadata;
	public connectorLabel: string;
	/**
	 * @param parsedData - Current state received from connector
	 * @param connector - Connector match object
	 */
	constructor(parsedData: State, connector: ConnectorMeta) {
		super();
		/**
		 * Safe copy of initial parsed data.
		 * Must not be modified.
		 */
		this.parsed = Object.assign(
			{
				track: null,
				artist: null,
				albumArtist: null,
				album: null,
				duration: null,
			},
			parsedData
		);

		/**
		 * Post-processed song data, for example auto-corrected.
		 * Initially filled with parsed data and optionally changed
		 * as the object is processed in pipeline. Can be modified.
		 */
		this.processed = {
			track: null,
			artist: null,
			albumArtist: null,
			album: null,
			duration: null,
		};

		/**
		 * Post-processed song data, excluding regex-based changes.
		 * Initially filled with parsed data and optionally changed
		 * as the object is processed in pipeline. Should not be modified outside pipeline.
		 * Used for regex edit preview for user convenience.
		 */
		this.noRegex = {
			track: null,
			artist: null,
			albumArtist: null,
			album: null,
			duration: null,
		};

		/**
		 * Song flags. Can be modified.
		 */
		this.flags = {
			/* Filled in `initFlags` method */
		};

		/**
		 * Optional data. Can be modified.
		 */
		this.metadata = {
			/* Filled in `initMetadata` method */
		};

		this.connectorLabel = connector.label;

		this.initSongData();
	}

	public resetInfo(): void {
		this.initProcessedData();
	}

	public resetData(): void {
		this.initFlags();
		this.initMetadata();
	}

	/** Private methods. */

	private initSongData(): void {
		this.initFlags();
		this.initMetadata();
		this.initProcessedData();
	}

	private initFlags(): void {
		this.flags = {
			/**
			 * Flag means song is scrobbled successfully.
			 */
			isScrobbled: false,

			/**
			 * Flag indicated song info is changed or approved by user.
			 */
			isCorrectedByUser: false,

			/**
			 * Flag indicating song info has been affected by a user regex/bulk edit
			 */
			isRegexEditedByUser: {
				track: false,
				artist: false,
				album: false,
				albumArtist: false,
			},

			/**
			 * Flag indicating that the album of the current track was fetched from the Last.fm API
			 */
			isAlbumFetched: false,

			/**
			 * Flag indicated song is known by scrobbling service.
			 */
			isValid: false,

			/**
			 * Flag indicates song is marked as playing by controller.
			 */
			isMarkedAsPlaying: false,

			/**
			 * Flag means song is ignored by controller.
			 */
			isSkipped: false,

			/**
			 * Flag means song is replaying again.
			 */
			isReplaying: false,
		};
	}

	private initMetadata(): void {
		this.metadata = {
			/**
			 * Flag indicates song is loved by used on service.
			 */
			userloved: undefined,

			/**
			 * Time when song is started playing in UNIX timestamp format.
			 */
			startTimestamp: Math.floor(Date.now() / 1000),

			label: this.connectorLabel,
		};
	}

	private initProcessedData(): void {
		for (const field of Song.PROCESSED_FIELDS) {
			this.processed[field] = null;
			this.noRegex[field] = null;
		}
	}
}
