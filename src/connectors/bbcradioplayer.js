'use strict';

const nowPlayingSelector = '#now-playing .playlister';

Connector.playerSelector = '.programme-details-wrapper';

Connector.artistSelector = `${nowPlayingSelector} .track .artist`;

Connector.trackSelector = `${nowPlayingSelector} .track .title`;

Connector.getUniqueID = () => {
	return $('#data-uid').text();
};

// Data provided rounds duration UP to next minute... Is usually longer than the Last.fm version data.
Connector.getDuration = () => {
	return $('#data-end').text() - $('#data-start').text();
};

Connector.isPlaying = () => {
	return $(nowPlayingSelector).length > 0;
};

Connector.trackArtSelector = '.radioplayer .playlister.playlister-expanded > img';

Connector.isTrackArtDefault = (url) => url.includes('generictrack');
