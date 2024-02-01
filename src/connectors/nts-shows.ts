export {};

Connector.playerSelector = '.episode-player-wrapper';

Connector.isPlaying = () => {
	return document.querySelector('.icon-pause') !== null;
};

// Connector.artistSelector =
// 	'.episode-player-tracklist__track--is-playing .episode-player-tracklist__artist';

// Connector.trackSelector =
// 	'.episode-player-tracklist__track--is-playing .episode-player-tracklist__title';

Connector.getArtistTrack = () => {
	let artist = null;
	let track = null;

	const trackinfo = document.querySelector(
		'.episode-player-tracklist__track--is-playing',
	);

	if (trackinfo) {
		const artistElement = trackinfo.querySelector(
			'.episode-player-tracklist__artist',
		);
		const trackElement = trackinfo.querySelector(
			'.episode-player-tracklist__title',
		);
		if (artistElement) {
			artist = artistElement.textContent;
		}
		if (trackElement) {
			track = trackElement.textContent;
		}
	}

	return { artist, track };
};

Connector.scrobbleInfoLocationSelector = '.bio__title__subtitle';
Connector.scrobbleInfoStyle = {
	...Connector.scrobbleInfoStyle,
	fontSize: '0.7em',
	marginTop: '1em',
	marginBottom: '-0.5em',
};
