'use strict';

Connector.playerSelector = '.qt-musicplayer';

Connector.artistTrackSelector = '#streamCurrentlyPlaying';

Connector.getArtistTrack = () => {
	let text = $(Connector.artistTrackSelector).text().replace('NOW PLAYING:', '');
	return Util.splitArtistTrack(text);
};

Connector.pauseButtonSelector = '.sm2_playing';
