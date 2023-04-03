// TODO: verify these types are actually what the api returns
interface AudioScrobblerScrobbleEntry {
	corrected: string;
	'#text'?: string;
}

export interface AudioScrobblerTrackScrobbleResponse
	extends Record<string, unknown> {
	scrobbles: {
		'@attr': {
			accepted: string;
			ignored: string;
		};
		scrobble: {
			scrobbles: {
				artist: AudioScrobblerScrobbleEntry;
				ignoredMessage: {
					code: string;
					message: string;
				};
				albumArtist: AudioScrobblerScrobbleEntry;
				timestamp: string;
				album: AudioScrobblerScrobbleEntry;
				track: AudioScrobblerScrobbleEntry;
			}[];
		};
	};
}

export interface AudioScrobblerSessionResponse extends Record<string, unknown> {
	session: {
		subscriber: number;
		name: string;
		key: string;
	};
}
