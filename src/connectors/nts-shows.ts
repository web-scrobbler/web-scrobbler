export {};

Connector.playerSelector = '.episode-player-wrapper';

Connector.isPlaying = () => {
	const title = document.querySelector('.soundcloud-player__play-icon title');
	if (title && title.textContent === 'Play') {
		return false;
	}
	return true;
};

Connector.getTrack = () =>
	document.querySelector(
		'.episode-player-tracklist__track--is-playing .episode-player-tracklist__title',
	)?.textContent;

Connector.getArtist = () =>
	document.querySelector(
		'.episode-player-tracklist__track--is-playing .episode-player-tracklist__artist',
	)?.textContent;

Connector.scrobbleInfoLocationSelector = '.soundcloud-player__content';
Connector.scrobbleInfoStyle = {
	...Connector.scrobbleInfoStyle,
	fontSize: '0.5em',
	marginLeft: '2em',
};
