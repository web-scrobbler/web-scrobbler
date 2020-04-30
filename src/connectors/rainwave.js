'use strict';

const artistSelector = '.now_playing .artist a';

Connector.useMediaSessionApi();

Connector.playerSelector = 'body';

Connector.getArtist = () => {
	const artists = document.querySelectorAll(artistSelector);
	return Util.joinArtists(Array.from(artists));
};

Connector.trackSelector = '.now_playing .title';

Connector.albumSelector = '.now_playing .album';

Connector.trackArtSelector = '.now_playing .art_container';

Connector.isPlaying = () => Util.hasElementClass('#r4_audio_player', 'playing');
