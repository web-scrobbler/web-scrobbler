'use strict';

Connector.playerSelector = '.qt-musicplayer';

Connector.artistTrackSelector = '#streamCurrentlyPlaying';

Connector.getArtistTrack = () => {
	let text = $(Connector.artistTrackSelector).text().replace('NOW PLAYING:', '');
	return Util.splitArtistTrack(text);
};

Connector.isPlaying = () => $('.sm2_playing').length > 0;
Connector.playButtonSelector = '.sm2_playing';
