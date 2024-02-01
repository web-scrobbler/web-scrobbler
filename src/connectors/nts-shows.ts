export {};

Connector.playerSelector = '.episode-player-wrapper';

Connector.isPlaying = () => {
	let title = document.querySelector('.soundcloud-player__play-icon title');
	if (title && title.textContent === 'Play') {
		return false;
	}
	return true;
};

Connector.getTrack = () => {
	let track = null;

	const trackElement = document.querySelector(
		'.episode-player-tracklist__track--is-playing .episode-player-tracklist__title',
	);

	if (trackElement) {
		track = trackElement.textContent;
	}

	return track;
};

Connector.getArtist = () => {
	let artist = null;

	const artistElement = document.querySelector(
		'.episode-player-tracklist__track--is-playing .episode-player-tracklist__artist',
	);

	if (artistElement) {
		artist = artistElement.textContent;
	}

	return artist;
};

Connector.scrobbleInfoLocationSelector = '.soundcloud-player__content';
Connector.scrobbleInfoStyle = {
	...Connector.scrobbleInfoStyle,
	fontSize: '0.5em',
	marginLeft: '1em',
};
