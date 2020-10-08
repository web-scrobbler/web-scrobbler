'use strict';

const artistName = 'Bull of Heaven';

const trackRegex = /\d+ - /;

const playButtonSelector = '.jp-play';

Connector.playerSelector = '#jp_container_N';

Connector.getArtist = () => artistName;

Connector.getTrack = () => {
	const trackElement = document.querySelector('.jp-playlist-current .playlist-title');
	return trackElement.textContent.replace(trackRegex, '');
};

Connector.trackArtSelector = '#jp_poster_0';

Connector.currentTimeSelector = '.jp-current-time';

Connector.durationSelector = '.jp-duration';

Connector.isPlaying = () => !Util.isElementVisible(playButtonSelector);
