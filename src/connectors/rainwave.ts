export {};

Connector.useMediaSessionApi();

Connector.playerSelector = 'body';

Connector.getArtist = () => {
	const artists = [...document.querySelectorAll('.now_playing .artist a')];
	return Util.joinArtists(artists);
};

Connector.trackSelector = '.now_playing .title';

Connector.albumSelector = '.now_playing .album';

Connector.trackArtSelector = '.now_playing .art_container';

Connector.isPlaying = () => Util.hasElementClass('#r4_audio_player', 'playing');
