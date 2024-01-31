export {};

Connector.playerSelector = '.page-live-tracks__body';

Connector.isPlaying = () => {
	return true;
};

// Maintain last played track on each channel so that if a user is switching back and forth between the same channels, it doesn't scrobble the same track twice.
// This would be better if we could only add it when the track is actually scrobbled, i.e. at half way point or whenever it happens.
let channelTracks: { [key: string]: string | null } = {};

Connector.getArtistTrack = () => {
	let channel = null;
	let artist = null;
	let track = null;

	const selectElement = document.querySelector(
		'.page-live-tracks__select',
	) as HTMLSelectElement;
	if (selectElement) {
		channel = selectElement.value;
	}

	const trackinfo = document.querySelector(
		'.page-live-tracks__list li:first-child',
	);

	if (trackinfo) {
		const artistElement = trackinfo.querySelector(
			'.page-live-tracks__artist-title',
		);
		const trackElement = trackinfo.querySelector(
			'.page-live-tracks__song-title',
		);
		if (artistElement) {
			artist = artistElement.textContent || '';
		}
		if (trackElement) {
			track = trackElement.textContent || '';
		}
	}

	if (channel && track === channelTracks[channel]) {
		return null;
	} else if (channel) {
		channelTracks[channel] = track;
	}

	console.log(channelTracks);

	return { artist, track };
};
