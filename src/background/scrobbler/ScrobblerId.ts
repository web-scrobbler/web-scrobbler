export enum ScrobblerId {
	LastFm = 'lastfm',
	LibreFm = 'librefm',
	ListenBrainz = 'listenbrainz',
	Maloja = 'maloja',
}

export function getAllScrobblerIds(): ReadonlyArray<ScrobblerId> {
	return Object.values(ScrobblerId);
}
