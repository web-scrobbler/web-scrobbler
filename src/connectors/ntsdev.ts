export {};

/**
 * The last track title. Used for detecting new songs.
 */
let lastTrackTitle: string | null = null;

function channelPlaying() {
	if (!checkIfPlaying()) {
		return null;
	} else if (document.querySelector('.live-channel--playing.channel-2')) {
		return '2';
	} else {
		return '1';
	}
}

let songInfo: {
	artist: string | null;
	track: string | null;
} | null = null;

Connector.playerSelector = '#nts-live-header';

function checkIfPlaying() {
	return (
		Boolean(document.querySelector('.live-channel--playing')) ||
		Boolean(document.querySelector('svg[title="Stop"]'))
	);
}

// Check if the live-channel--playing element is visible or there is an SVG on the page with the title "Stop".
Connector.isPlaying = () => {
	return checkIfPlaying();
};

Connector.getArtistTrack = () => {
	getSongInfo();
	return songInfo;
};

/**
 * Check if song is changed.
 * @returns true if new song is playing; false otherwise
 */
async function getSongInfo() {
	let artist = null;
	let track = null;

	const channelId = channelPlaying();
	console.log(channelId);

	const response = await fetch(
		`https://www.nts.live/live-tracklist/${channelId}`,
	);
	const result = await response.text();

	console.log(result);
	const doc = new DOMParser().parseFromString(result, 'text/html');
	const trackinfo = doc.querySelector(
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
	console.log(artist);
	console.log(track);

	songInfo = { artist, track };
}
