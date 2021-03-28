'use strict';

Connector.playerSelector = '#player';
Connector.trackArtSelector = '#imgCover';

Connector.isPlaying = () => Util.hasElementClass('#player', 'playing');

Connector.getTrackInfo = () => {
	const artist = Util.getTextFromSelectors('#artist').replace('von ', '');
	const track = Util.getTextFromSelectors('#title');
	const album = Util.getTextFromSelectors('#album').replace(', Album: ', '');

	return { artist, track, album };
};
