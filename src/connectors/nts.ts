export {};

Connector.playerSelector = '.page-live-tracks__body';

Connector.getArtistTrack = () => {
	let artist = null;
	let track = null;

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

	return { artist, track };
};

Connector.scrobbleInfoLocationSelector = '.page-live-tracks__title';
Connector.scrobbleInfoStyle = {
	...Connector.scrobbleInfoStyle,
	fontSize: '0.7em',
	marginTop: '0.7em',
};
