// TODO: verify these types are actually what the api returns
interface AudioScrobblerScrobbleEntry {
	corrected: string;
	'#text'?: string;
}

interface AudioScrobblerScrobble {
	artist: AudioScrobblerScrobbleEntry;
	ignoredMessage: {
		code: string;
		message: string;
	};
	albumArtist: AudioScrobblerScrobbleEntry;
	timestamp: string;
	album: AudioScrobblerScrobbleEntry;
	track: AudioScrobblerScrobbleEntry;
}

export interface AudioScrobblerTrackScrobbleResponse
	extends Record<string, unknown> {
	scrobbles: {
		'@attr': {
			accepted: number | string;
			ignored: number | string;
		};
		scrobble: AudioScrobblerScrobble | AudioScrobblerScrobble[];
	};
}

export interface AudioScrobblerSessionResponse extends Record<string, unknown> {
	session: {
		subscriber: number;
		name: string;
		key: string;
	};
}
