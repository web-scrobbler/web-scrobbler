export {};

Connector.playerSelector = [
	'#react-content:not(.react-content--player-margin), div:not(.visuallyhidden) > .soundcloud-player, main.page-live-tracks',
];
Connector.artistSelector = [
	'h2.live-track__artist-title, .episode-player-tracklist__artist',
];
Connector.trackSelector = [
	'span.live-track__song-title, .episode-player-tracklist__title',
];

if (document.querySelector('main.page-live-tracks') !== null) {
	Connector.isPlaying = () => {
		const title = document.querySelector('button svg[svg*="-icon"] title');
		if (title && title.textContent === 'Play') {
			return false;
		}
		return true;
	};
}

Connector.scrobbleInfoLocationSelector =
	'.page-live-tracks__title, .soundcloud-player__content';
Connector.scrobbleInfoStyle = {
	...Connector.scrobbleInfoStyle,
	fontSize: '0.7em',
	marginTop: '0.7em',
};
