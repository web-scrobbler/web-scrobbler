interface BaseSongInfo {
	artist: string;
	track: string;
	album?: string;
	albumArtist?: string;
}

export interface ParsedSongInfo {
	artist: string;
	track: string;
	album?: string;
	albumArtist?: string;
	currentTime?: number;
	isPlaying?: boolean;
	isPodcast?: boolean;
	originUrl?: string;
	trackArt?: string;
	uniqueID?: string;
	duration?: number;
}

export interface ProcessedSongInfo extends BaseSongInfo {
	duration?: number;
}

export interface SongMetadata {
	/**
	 * Flag indicates song is loved by used on service.
	 */
	userloved: boolean | undefined;

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

export interface ClonedSong {
	readonly parsed: Readonly<ParsedSongInfo>;
	readonly processed: Readonly<ProcessedSongInfo>;
	readonly flags: Readonly<SongFlags>;
	readonly metadata: Readonly<SongMetadata>;
}

export interface SongInfo extends BaseSongInfo {
	duration?: number;
	originUrl?: string;
	timestamp?: number;
}

export type EditedSongInfo = BaseSongInfo;

export type BaseSongField = keyof BaseSongInfo;

export class Song {
	parsed: ParsedSongInfo;
	processed: ProcessedSongInfo;
	metadata: SongMetadata;
	flags: SongFlags;

	/**
	 * Artist field.
	 */
	static readonly FIELD_ARTIST: BaseSongField = 'artist';

	/**
	 * Track field.
	 */
	static readonly FIELD_TRACK: BaseSongField = 'track';

	/**
	 * Album field.
	 */
	static readonly FIELD_ALBUM: BaseSongField = 'album';

	/**
	 * Album artist field.
	 */
	static readonly FIELD_ALBUM_ARTIST: BaseSongField = 'albumArtist';

	/**
	 * Fields used to identify song.
	 */
	static readonly BASE_FIELDS: BaseSongField[] = [
		Song.FIELD_ARTIST,
		Song.FIELD_TRACK,
		Song.FIELD_ALBUM,
		Song.FIELD_ALBUM_ARTIST,
	];

	/**
	 * @constructor
	 * @param parsedData Current state received from connector
	 */
	constructor(parsedData: ParsedSongInfo) {
		/**
		 * Safe copy of initial parsed data.
		 * Must not be modified.
		 */
		this.parsed = Object.assign({}, parsedData);

		this.initSongData();
	}

	getField<K extends keyof ProcessedSongInfo>(
		field: K
	): ProcessedSongInfo[K] {
		return this.processed[field] || this.parsed[field];
	}

	/**
	 * Get song artist.
	 *
	 * @return Song artist
	 */
	getArtist(): string {
		return this.getField(Song.FIELD_ARTIST);
	}

	/**
	 * Get song title.
	 *
	 * @return Song title
	 */
	getTrack(): string {
		return this.getField(Song.FIELD_TRACK);
	}

	/**
	 * Get song album.
	 *
	 * @return Song album
	 */
	getAlbum(): string {
		return this.getField(Song.FIELD_ALBUM);
	}

	/**
	 * Get song album artist.
	 * @return Song album artist
	 */
	getAlbumArtist(): string {
		return this.getField(Song.FIELD_ALBUM_ARTIST);
	}

	/**
	 * Returns song's processed or parsed duration in seconds.
	 * Parsed duration (received from connector) is preferred.
	 *
	 * @return Song duration
	 */
	getDuration(): number {
		return this.parsed.duration || this.processed.duration || 0;
	}

	/**
	 * Return the track art URL associated with the song.
	 * Parsed track art (received from connector) is preferred.
	 *
	 * @return Track art URL
	 */
	getTrackArt(): string {
		return this.parsed.trackArt || this.metadata.trackArtUrl || null;
	}

	/**
	 * Get formatted "Artist - Track" string. Return null if song is empty.
	 *
	 * @return Formatted string
	 */
	getArtistTrackString(): string {
		if (this.isEmpty()) {
			return null;
		}
		return `${this.getArtist()} — ${this.getTrack()}`;
	}

	/**
	 * Get song unique ID.
	 *
	 * @return Unique ID
	 */
	getUniqueId(): string {
		return this.parsed.uniqueID || null;
	}

	/**
	 * Get song source URL.
	 *
	 * @return source URL.
	 */
	getOriginUrl(): string {
		return this.parsed.originUrl;
	}

	/**
	 * Check if song is empty. Empty song means it's missing
	 * either artist or track title.
	 *
	 * @return True if song is empty; false otherwise
	 */
	isEmpty(): boolean {
		return !(this.getArtist() && this.getTrack());
	}

	/**
	 * Check if song is valid. The song means valid if it's known by
	 * scrobbler service or is corrected by the user.
	 *
	 * @return True if song is valid; false otherwise
	 */
	isValid(): boolean {
		return this.flags.isValid || this.flags.isCorrectedByUser;
	}

	/**
	 * Check if song equals another song.
	 * @param song Song instance to compare
	 * @return Check result
	 */
	equals(song: unknown): boolean {
		if (!song) {
			return false;
		}

		if (!(song instanceof Song)) {
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
	 * Set `Love` status of song.
	 *
	 * This function is supposed to be used by multiple scrobblers
	 * (services). Each service can have different value of `Love` flag;
	 * the behavior of the function is to set `Love` to true, if all
	 * services have the song with `Love` set to true.
	 *
	 * @param isLoved Flag means song is loved or not
	 * @param flags Flags
	 * @param [flags.force=false] Force status assignment
	 */
	setLoveStatus(isLoved: boolean, { force = false } = {}): void {
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
	 * Get a string representing the song.
	 *
	 * @return String representing the object.
	 */
	toString(): string {
		return JSON.stringify(this, null, 2);
	}

	/**
	 * Get song data to send it to different context.
	 *
	 * @return Object contain song data
	 */
	getCloneableData(): ClonedSong {
		return {
			flags: this.flags,
			metadata: this.metadata,
			parsed: this.parsed,
			processed: this.processed,
		};
	}

	/**
	 * Return an object containing song info. The object should contain
	 * all information required to send now playing and scrobble requests.
	 *
	 * @return Song info
	 */
	getInfo(): SongInfo {
		return {
			track: this.getTrack(),
			album: this.getAlbum(),
			artist: this.getArtist(),
			duration: this.getDuration(),
			originUrl: this.getOriginUrl(),
			albumArtist: this.getAlbumArtist(),
			timestamp: this.metadata.startTimestamp,
		};
	}

	/**
	 * Set default song info (artist, track, etc).
	 */
	resetInfo(): void {
		this.initProcessedData();
	}

	/**
	 * Set default song data (flags and metadata only).
	 */
	resetData(): void {
		this.initFlags();
		this.initMetadata();
	}

	/**
	 * Wrap a given cloned data into a new Song object.
	 *
	 * @param clonedData Copy of song instance
	 *
	 * @return Song instance
	 */
	static wrap(clonedData: ClonedSong): Song {
		const { parsed, processed, metadata, flags } = clonedData;

		const song = new Song(parsed);
		song.processed = processed;
		song.metadata = metadata;
		song.flags = flags;

		return song;
	}

	private initSongData(): void {
		this.initFlags();
		this.initMetadata();
		this.initProcessedData();
	}

	private initFlags(): void {
		this.flags = {
			isCorrectedByUser: false,
			isMarkedAsPlaying: false,
			isReplaying: false,
			isScrobbled: false,
			isSkipped: false,
			isValid: false,
		};
	}

	private initMetadata(): void {
		this.metadata = {
			userloved: undefined,
			startTimestamp: Math.floor(Date.now() / 1000),
		};
	}

	private initProcessedData(): void {
		this.processed = {
			artist: null,
			track: null,
			album: null,
			albumArtist: null,
			duration: 0,
		};
	}
}
